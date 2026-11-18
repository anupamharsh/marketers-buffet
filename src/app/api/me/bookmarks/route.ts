import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { getUser } from "@/lib/server/auth";
import { error, readJson } from "@/lib/server/security";
import { findItem } from "@/content";
import type { Kind } from "@/content/types";

async function parse(req: Request) {
  const b = await readJson<{ kind?: unknown; slug?: unknown }>(req);
  const kind = typeof b?.kind === "string" ? (b.kind as Kind) : null;
  const slug = typeof b?.slug === "string" ? b.slug : null;
  return kind && slug && findItem(kind, slug) ? { kind, slug } : null;
}

export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return error(401, "signed_out", "Sign in first.");
  const rows = await q("select kind, slug from mb.bookmarks where user_id = $1", [user.id]);
  return NextResponse.json({ ok: true, bookmarks: rows });
}

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return error(401, "signed_out", "Sign in to save this.");
  const item = await parse(req);
  if (!item) return error(400, "invalid", "Bad request");
  await q("insert into mb.bookmarks (user_id, kind, slug) values ($1,$2,$3) on conflict do nothing", [user.id, item.kind, item.slug]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getUser(req);
  if (!user) return error(401, "signed_out", "Sign in first.");
  const item = await parse(req);
  if (!item) return error(400, "invalid", "Bad request");
  await q("delete from mb.bookmarks where user_id = $1 and kind = $2 and slug = $3", [user.id, item.kind, item.slug]);
  return NextResponse.json({ ok: true });
}
