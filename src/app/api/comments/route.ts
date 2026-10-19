import { NextResponse } from "next/server";

/**
 * Comment submission. Every comment goes into a moderation queue (approve,
 * delete, block) and is never published directly.
 * TODO(cms): persist to the CMS / comments service once chosen. Add rate
 * limiting and bot protection before launch — this endpoint is public.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { slug, name, text } = (body ?? {}) as Record<string, unknown>;
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(slug)) return NextResponse.json({ ok: false, error: "invalid_post" }, { status: 422 });
  if (typeof name !== "string" || name.trim().length < 1 || name.length > 60) return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 422 });
  if (typeof text !== "string" || text.trim().length < 2 || text.length > 2000) return NextResponse.json({ ok: false, error: "invalid_text" }, { status: 422 });

  return NextResponse.json({ ok: true, status: "pending_moderation" });
}
