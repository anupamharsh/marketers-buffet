import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { markPaid, verifyWebhookSignature } from "@/lib/server/razorpay";

/**
 * Razorpay webhook (source of truth). Fires even if the buyer closed the tab.
 * Events: payment.captured, payment.failed, refund.processed.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > 100_000 || !verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature") || "")) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let evt: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } }; refund?: { entity?: { payment_id?: string } } } };
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const p = evt.payload?.payment?.entity;
  if (evt.event === "payment.captured" && p?.order_id && p.id) await markPaid(p.order_id, p.id);
  if (evt.event === "payment.failed" && p?.order_id) await q("update mb.orders set status = 'failed' where razorpay_order_id = $1 and status = 'created'", [p.order_id]);
  const refundPay = evt.payload?.refund?.entity?.payment_id;
  if (evt.event === "refund.processed" && refundPay) await q("update mb.orders set status = 'refunded' where razorpay_payment_id = $1", [refundPay]);
  return NextResponse.json({ ok: true });
}
