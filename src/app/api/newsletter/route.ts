import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LOCATIONS = new Set(["hero", "footer", "post", "newsletter_page", "home"]);

/**
 * Newsletter signup.
 * TODO(provider): forward to the chosen email tool (e.g. Buttondown, ConvertKit,
 * Brevo) using a server-side API key from env. Add rate limiting / bot protection
 * (e.g. Turnstile) before launch — this endpoint is public by design.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const { email, location } = (body ?? {}) as { email?: unknown; location?: unknown };
  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }
  if (typeof location !== "string" || !LOCATIONS.has(location)) {
    return NextResponse.json({ ok: false, error: "invalid_location" }, { status: 422 });
  }

  // Provider call goes here. Never log the email address.
  return NextResponse.json({ ok: true });
}
