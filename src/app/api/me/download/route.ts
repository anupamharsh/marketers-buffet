import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { getUser } from "@/lib/server/auth";
import { error, readJson } from "@/lib/server/security";
import { templateLinks } from "@/lib/server/razorpay";
import { getTemplate } from "@/content/templates";

/** Re-download anything you own (paid) or have downloaded before (free). */
export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return error(401, "signed_out", "Sign in first.");
  const b = await readJson<{ slug?: unknown }>(req);
  const t = typeof b?.slug === "string" ? getTemplate(b.slug) : undefined;
  if (!t) return error(404, "not_found", "Template not found.");
  if (t.price !== null) {
    const owned = await q(
      "select 1 from mb.orders where template_slug = $1 and status = 'paid' and (user_id = $2 or lower(email) = lower($3)) limit 1",
      [t.slug, user.id, user.email ?? ""],
    );
    if (!owned.length) return error(403, "not_owned", "Buy it first, then it's yours to re-download any time.");
  }
  return NextResponse.json({ ok: true, links: await templateLinks(t.slug) });
}
