import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { q } from "@/lib/server/db";

/**
 * Cal ID webhook (Cal ID is built on Cal.com and signs the same way:
 * x-cal-signature-256 = HMAC-SHA256(raw body, secret), hex).
 * Events: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED, BOOKING_PAID.
 * Stores calls so they show in Account › My calls.
 */
function validSignature(raw: string, sig: string) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret || !sig) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(sig.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

type Payload = {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    rescheduleUid?: string;
    title?: string;
    startTime?: string;
    endTime?: string;
    attendees?: { email?: string; name?: string }[];
  };
};

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > 200_000 || !validSignature(raw, req.headers.get("x-cal-signature-256") || "")) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let evt: Payload;
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const p = evt.payload;
  const who = p?.attendees?.[0];
  if (!p?.uid || !who?.email) return NextResponse.json({ ok: true, ignored: true });

  const status =
    evt.triggerEvent === "BOOKING_CANCELLED" ? "cancelled" : evt.triggerEvent === "BOOKING_RESCHEDULED" ? "rescheduled" : "booked";
  if (!["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED", "BOOKING_PAID"].includes(evt.triggerEvent || "")) {
    return NextResponse.json({ ok: true, ignored: true });
  }
  // A reschedule creates a new uid; mark the old one so it isn't listed twice.
  if (status === "rescheduled" && p.rescheduleUid) {
    await q("update mb.calls set status = 'cancelled', updated_at = now() where uid = $1", [p.rescheduleUid]);
  }
  await q(
    `insert into mb.calls (uid, email, name, title, start_at, end_at, status) values ($1, lower($2), $3, $4, $5, $6, $7)
     on conflict (uid) do update set start_at = coalesce($5, mb.calls.start_at), end_at = coalesce($6, mb.calls.end_at),
       title = coalesce($4, mb.calls.title), status = $7, updated_at = now()`,
    [p.uid, who.email.slice(0, 254), (who.name || "").slice(0, 80), (p.title || "").slice(0, 160), p.startTime ?? null, p.endTime ?? null, status === "rescheduled" ? "booked" : status],
  );
  return NextResponse.json({ ok: true });
}
