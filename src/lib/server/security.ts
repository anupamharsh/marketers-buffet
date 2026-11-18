import "server-only";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { q } from "./db";

const LIMIT = 5; // per form, per hour, per IP and per device
const WINDOW_MIN = 60;

/** Visitor IP as reported by Netlify (falls back to the proxy header locally). */
export function clientIp(req: Request) {
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

/** IPs are only ever stored as a salted hash, never raw. */
export function ipHash(req: Request) {
  const salt = process.env.IP_HASH_SALT || "dev-salt";
  return createHash("sha256").update(clientIp(req) + salt).digest("hex").slice(0, 40);
}

/** Device id: a random id kept in the visitor's browser (cookie mb_did). */
export function deviceId(req: Request) {
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)mb_did=([a-zA-Z0-9-]{8,64})/);
  return m ? m[1] : null;
}

export async function verifyTurnstile(token: unknown, req: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production"; // allow local dev without keys
  if (typeof token !== "string" || token.length < 10 || token.length > 4096) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: clientIp(req) }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/**
 * Checks block list + rate limit, then records the attempt.
 * Returns a ready error response, or null if the request may continue.
 */
export async function guard(req: Request, bucket: string, token: unknown) {
  const ip = ipHash(req);
  const dev = deviceId(req);
  const keys = [`ip:${ip}`, ...(dev ? [`dev:${dev}`] : [])];

  const blocked = await q("select 1 from mb.blocked where key = any($1) limit 1", [keys]);
  if (blocked.length) return error(403, "blocked", "This browser can't post here.");

  const counts = await q<{ key: string; n: string }>(
    `select key, count(*)::text as n from mb.rate_events
     where bucket = $1 and key = any($2) and created_at > now() - ($3 || ' minutes')::interval
     group by key`,
    [bucket, keys, String(WINDOW_MIN)],
  );
  if (counts.some((c) => Number(c.n) >= LIMIT)) {
    return error(429, "rate_limited", "That's a few too many tries. Give it an hour and try again.");
  }

  if (!(await verifyTurnstile(token, req))) {
    return error(400, "bot_check_failed", "The human check didn't go through. Refresh the page and try again.");
  }

  await q("insert into mb.rate_events (bucket, key) select $1, unnest($2::text[])", [bucket, keys]);
  // Housekeeping: drop rows older than a day (cheap, indexed).
  void q("delete from mb.rate_events where created_at < now() - interval '1 day'").catch(() => {});
  return null;
}

export function error(status: number, code: string, message: string) {
  return NextResponse.json({ ok: false, error: code, message }, { status });
}

export async function readJson<T = Record<string, unknown>>(req: Request, maxBytes = 16_384): Promise<T | null> {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > maxBytes) return null;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (v: unknown): v is string => typeof v === "string" && v.length <= 254 && EMAIL_RE.test(v);

export const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
