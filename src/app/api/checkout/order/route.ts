import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { guard, isEmail, readJson, error } from "@/lib/server/security";
import { getUser } from "@/lib/server/auth";
import { createOrder } from "@/lib/server/razorpay";
import { getTemplate } from "@/content/templates";

/** Step 1 of a purchase: create the Razorpay order on the server. */
export async function POST(req: Request) {
  const b = await readJson<{ slug?: unknown; email?: unknown; token?: unknown }>(req);
  const t = typeof b?.slug === "string" ? getTemplate(b.slug) : undefined;
  if (!b || !t || t.price === null) return error(404, "not_found", "That template isn't for sale.");
  if (!process.env.RAZORPAY_KEY_SECRET) return error(503, "not_configured", "Payments aren't switched on yet.");

  const user = await getUser(req);
  const email = user?.email ?? (isEmail(b.email) ? b.email.trim().toLowerCase() : null);
  if (!email) return error(422, "invalid_email", "Add your email so we can send your receipt and download.");

  const blocked = await guard(req, "checkout", b.token);
  if (blocked) return blocked;

  const amount = t.price * 100;
  const order = await createOrder(amount, `${t.slug}-${Date.now()}`, { template: t.slug });
  await q(
    `insert into mb.orders (razorpay_order_id, template_slug, amount, currency, email, user_id) values ($1,$2,$3,'INR',$4,$5)`,
    [order.id, t.slug, amount, email, user?.id ?? null],
  );
  return NextResponse.json({ ok: true, orderId: order.id, amount, currency: "INR", keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, email, name: t.name });
}
