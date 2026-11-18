import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { guard, readJson, error, clean, ipHash } from "@/lib/server/security";
import { getUser } from "@/lib/server/auth";

const KINDS = new Set(["blog", "automations", "ai-edge"]);
const SLUG = /^[a-z0-9-]{1,120}$/;

/** Approved comments for one page. */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const kind = u.searchParams.get("kind") || "";
  const slug = u.searchParams.get("slug") || "";
  if (!KINDS.has(kind) || !SLUG.test(slug)) return error(400, "invalid", "Bad request");
  const rows = await q<{ id: string; name: string; position: string | null; company: string | null; body: string; created_at: string }>(
    `select id, name, position, company, body, created_at from mb.comments
     where kind = $1 and slug = $2 and status = 'approved' order by created_at asc limit 200`,
    [kind, slug],
  );
  return NextResponse.json({ ok: true, comments: rows }, { headers: { "cache-control": "public, max-age=30, s-maxage=60" } });
}

/** New comment. Every comment waits for admin approval. */
export async function POST(req: Request) {
  const b = await readJson<Record<string, unknown>>(req);
  if (!b) return error(400, "invalid", "Something broke on our end. Try again in a moment.");
  const kind = clean(b.kind, 20);
  const slug = clean(b.slug, 120);
  const name = clean(b.name, 60);
  const position = clean(b.position, 60) || null;
  const company = clean(b.company, 60) || null;
  const text = typeof b.body === "string" ? b.body.trim().slice(0, 2000) : "";
  if (!KINDS.has(kind) || !SLUG.test(slug)) return error(400, "invalid", "Bad request");
  // Honeypot filled in: pretend it worked, store nothing.
  if (typeof b.website === "string" && b.website.trim()) return NextResponse.json({ ok: true, status: "pending" });
  if (!name) return error(422, "invalid_name", "Add your name so people know who's talking.");
  if (text.length < 2) return error(422, "invalid_body", "Write a little more so others know what you mean.");
  // Links are the main spam signal: allow at most one.
  if ((text.match(/https?:\/\//g) || []).length > 1) return error(422, "too_many_links", "Keep it to one link, please.");

  const blocked = await guard(req, "comment", b.token);
  if (blocked) return blocked;

  const user = await getUser(req);
  await q(
    `insert into mb.comments (kind, slug, name, position, company, body, user_id, ip_hash)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [kind, slug, name, position, company, text, user?.id ?? null, ipHash(req)],
  );
  return NextResponse.json({ ok: true, status: "pending" });
}
