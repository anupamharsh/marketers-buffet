import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { getUser } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";
import { findItem } from "@/content";
import type { Kind } from "@/content/types";

/** Records "recently viewed" for signed-in readers. Silent for everyone else. */
export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ ok: true });
  const b = await readJson<{ kind?: unknown; slug?: unknown }>(req);
  const kind = typeof b?.kind === "string" ? (b.kind as Kind) : null;
  const slug = typeof b?.slug === "string" ? b.slug : null;
  if (kind && slug && findItem(kind, slug)) {
    await q(
      `insert into mb.views (user_id, kind, slug) values ($1,$2,$3)
       on conflict (user_id, kind, slug) do update set viewed_at = now()`,
      [user.id, kind, slug],
    );
  }
  return NextResponse.json({ ok: true });
}
