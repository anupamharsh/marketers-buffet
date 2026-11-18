import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { q } from "@/lib/server/db";

/** Daily ping from cron-job.org so the free Supabase project never pauses. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET || "";
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const ok = secret.length > 0 && got.length === secret.length && timingSafeEqual(Buffer.from(got), Buffer.from(secret));
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  const rows = await q<{ pinged_at: string }>("update mb.keepalive set pinged_at = now() where id = 1 returning pinged_at");
  return NextResponse.json({ ok: true, pingedAt: rows[0]?.pinged_at });
}
