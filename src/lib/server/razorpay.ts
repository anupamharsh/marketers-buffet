import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { q } from "./db";
import { signedDownload } from "./storage";
import { sendEmail } from "./brevo";
import { getTemplate } from "@/content/templates";

const auth = () => "Basic " + Buffer.from(`${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");

/** Creates a Razorpay order. The amount always comes from the server, never the browser. */
export async function createOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: auth(), "content-type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt: receipt.slice(0, 40), notes }),
  });
  if (!res.ok) throw new Error(`Razorpay order failed: ${res.status}`);
  return (await res.json()) as { id: string; amount: number; currency: string };
}

function safeEqualHex(a: string, b: string) {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Checkout success signature: HMAC_SHA256(order_id|payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Webhook signature: HMAC_SHA256(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Signed links for every file in a template. */
export async function templateLinks(slug: string) {
  const t = getTemplate(slug);
  if (!t) return [];
  return Promise.all(t.files.map(async (f) => ({ label: f.label, url: await signedDownload(f.key, f.key.split("/").pop() || "download", 60 * 30) })));
}

/**
 * Marks an order paid (idempotent: the checkout callback and the webhook can
 * both arrive) and emails the buyer once a sender is configured.
 */
export async function markPaid(orderId: string, paymentId: string) {
  const rows = await q<{ template_slug: string; email: string | null; emailed: boolean }>(
    `update mb.orders set status = 'paid', razorpay_payment_id = $2, paid_at = coalesce(paid_at, now())
     where razorpay_order_id = $1 and status in ('created','failed','paid')
     returning template_slug, email, emailed`,
    [orderId, paymentId],
  );
  const o = rows[0];
  if (o && o.email && !o.emailed) {
    const t = getTemplate(o.template_slug);
    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    const sent = await sendEmail(
      o.email,
      `Your download: ${t?.name ?? "template"}`,
      `<p>Thanks for buying <strong>${t?.name ?? "the template"}</strong>.</p>
       <p>Download it any time from your account: <a href="${site}/account?tab=purchases">${site}/account</a> (sign in with this email).</p>
       <p>Receipt: order ${orderId}, payment ${paymentId}. Business: Marketers Buffet.</p>
       <p>No refunds on digital downloads. If a file is broken, reply to this email and we'll fix it.</p>`,
    );
    if (sent) await q("update mb.orders set emailed = true where razorpay_order_id = $1", [orderId]);
  }
  return o ?? null;
}
