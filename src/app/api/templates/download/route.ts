import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { guard, isEmail, readJson, error } from "@/lib/server/security";
import { getUser } from "@/lib/server/auth";
import { addToNewsletter } from "@/lib/server/brevo";
import { signedDownload } from "@/lib/server/storage";
import { getTemplate } from "@/content/templates";

/**
 * Free template download. Asks for an email (skipped when signed in), adds it
 * to the newsletter list, then returns short-lived signed links.
 */
export async function POST(req: Request) {
  const b = await readJson<{ slug?: unknown; email?: unknown; token?: unknown }>(req);
  const t = typeof b?.slug === "string" ? getTemplate(b.slug) : undefined;
  if (!b || !t) return error(404, "not_found", "That template doesn't exist.");
  if (t.price !== null) return error(402, "paid", "This one is paid. Use Buy now.");

  const user = await getUser(req);
  const email = user?.email ?? (isEmail(b.email) ? b.email.trim().toLowerCase() : null);
  if (!email) return error(422, "invalid_email", "Add your email and the download starts right away.");

  if (!user) {
    const blocked = await guard(req, "download", b.token);
    if (blocked) return blocked;
  }

  await q(`insert into mb.subscribers (email, source) values ($1, 'template') on conflict (email) do nothing`, [email]);
  void addToNewsletter(email, { SOURCE: "template" });
  await q("insert into mb.downloads (template_slug, email, user_id) values ($1,$2,$3)", [t.slug, email, user?.id ?? null]);

  const links = await Promise.all(t.files.map(async (f) => ({ label: f.label, url: await signedDownload(f.key, f.key.split("/").pop() || "download") })));
  return NextResponse.json({ ok: true, links });
}
