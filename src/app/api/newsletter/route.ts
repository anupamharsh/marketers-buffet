import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { guard, isEmail, readJson, error, clean } from "@/lib/server/security";
import { addToNewsletter } from "@/lib/server/brevo";

/** Newsletter signup: Turnstile + 5/hour limit → our table → Brevo list. */
export async function POST(req: Request) {
  const body = await readJson<{ email?: unknown; location?: unknown; utm?: unknown; token?: unknown }>(req);
  if (!body) return error(400, "invalid", "Something broke on our end. Try again in a moment.");
  if (!isEmail(body.email)) return error(422, "invalid_email", "That email doesn't look right. Check for typos?");

  const blocked = await guard(req, "newsletter", body.token);
  if (blocked) return blocked;

  const email = body.email.trim().toLowerCase();
  const source = clean(body.location, 40) || "site";
  const utm = body.utm && typeof body.utm === "object" ? JSON.stringify(body.utm).slice(0, 600) : null;
  await q(
    `insert into mb.subscribers (email, source, utm) values ($1, $2, $3::jsonb)
     on conflict (email) do update set unsubscribed = false`,
    [email, source, utm],
  );
  const synced = await addToNewsletter(email, { SOURCE: source });
  if (synced) await q("update mb.subscribers set brevo_synced = true where email = $1", [email]);
  return NextResponse.json({ ok: true });
}
