import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { getUser } from "@/lib/server/auth";
import { error, readJson } from "@/lib/server/security";

/**
 * Comment moderation. Only signed-in users whose email is listed in
 * ADMIN_EMAILS (comma-separated, server-only env var) can use it.
 */
async function admin(req: Request) {
  const user = await getUser(req);
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return user?.email && allowed.includes(user.email.toLowerCase()) ? user : null;
}

const STATUSES = new Set(["pending", "approved", "rejected"]);
const UUID = /^[0-9a-f-]{36}$/i;

export async function GET(req: Request) {
  if (!(await admin(req))) return error(403, "forbidden", "Not allowed.");
  const status = new URL(req.url).searchParams.get("status") || "pending";
  if (!STATUSES.has(status)) return error(400, "invalid", "Bad request");
  const rows = await q(
    `select id, kind, slug, name, position, company, body, status, created_at from mb.comments
     where status = $1 order by created_at ${status === "pending" ? "asc" : "desc"} limit 200`,
    [status],
  );
  return NextResponse.json({ ok: true, comments: rows }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  if (!(await admin(req))) return error(403, "forbidden", "Not allowed.");
  const b = await readJson<{ id?: unknown; action?: unknown }>(req);
  const id = typeof b?.id === "string" && UUID.test(b.id) ? b.id : null;
  const action = typeof b?.action === "string" ? b.action : "";
  if (!id) return error(400, "invalid", "Bad request");
  switch (action) {
    case "approve":
      await q("update mb.comments set status = 'approved' where id = $1", [id]);
      break;
    case "reject":
      await q("update mb.comments set status = 'rejected' where id = $1", [id]);
      break;
    case "delete":
      await q("delete from mb.comments where id = $1", [id]);
      break;
    case "block": {
      // Blocks the commenter's IP hash from all forms, and rejects all their pending comments.
      const rows = await q<{ ip_hash: string | null }>("select ip_hash from mb.comments where id = $1", [id]);
      const ip = rows[0]?.ip_hash;
      if (ip) {
        await q("insert into mb.blocked (key, reason) values ($1, 'comment spam') on conflict do nothing", [`ip:${ip}`]);
        await q("update mb.comments set status = 'rejected' where ip_hash = $1 and status = 'pending'", [ip]);
      }
      await q("update mb.comments set status = 'rejected' where id = $1", [id]);
      break;
    }
    default:
      return error(400, "invalid", "Bad request");
  }
  return NextResponse.json({ ok: true });
}
