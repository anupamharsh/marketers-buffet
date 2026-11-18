import { NextResponse } from "next/server";
import { readJson, error } from "@/lib/server/security";
import { markPaid, templateLinks, verifyPaymentSignature } from "@/lib/server/razorpay";

/** Step 2: the browser reports success; we verify the signature before unlocking files. */
export async function POST(req: Request) {
  const b = await readJson<{ orderId?: unknown; paymentId?: unknown; signature?: unknown }>(req);
  const orderId = typeof b?.orderId === "string" ? b.orderId : "";
  const paymentId = typeof b?.paymentId === "string" ? b.paymentId : "";
  const signature = typeof b?.signature === "string" ? b.signature : "";
  if (!orderId || !paymentId || !signature || !verifyPaymentSignature(orderId, paymentId, signature)) {
    return error(400, "bad_signature", "We couldn't confirm that payment. If money left your account, email us.");
  }
  const order = await markPaid(orderId, paymentId);
  if (!order) return error(404, "not_found", "Order not found.");
  return NextResponse.json({ ok: true, links: await templateLinks(order.template_slug) });
}
