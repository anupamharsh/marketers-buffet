import { NextResponse } from "next/server";
import { q } from "@/lib/server/db";
import { getUser } from "@/lib/server/auth";
import { error, readJson, clean } from "@/lib/server/security";
import { addToNewsletter } from "@/lib/server/brevo";

/** Everything the account page needs, in one call. */
export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return error(401, "signed_out", "Sign in first.");
  const [profile, bookmarks, purchases, downloads, views, sub, calls] = await Promise.all([
    q("select name, position, company, newsletter from mb.profiles where user_id = $1", [user.id]),
    q("select kind, slug, created_at from mb.bookmarks where user_id = $1 order by created_at desc", [user.id]),
    q(
      `select template_slug, amount, paid_at, razorpay_order_id from mb.orders
       where status = 'paid' and (user_id = $1 or lower(email) = lower($2)) order by paid_at desc`,
      [user.id, user.email ?? ""],
    ),
    q("select template_slug, created_at from mb.downloads where user_id = $1 or lower(email) = lower($2) order by created_at desc limit 50", [user.id, user.email ?? ""]),
    q("select kind, slug, viewed_at from mb.views where user_id = $1 order by viewed_at desc limit 20", [user.id]),
    q("select unsubscribed from mb.subscribers where email = lower($1)", [user.email ?? ""]),
    q("select uid, title, start_at, end_at, status from mb.calls where email = lower($1) and status <> 'cancelled' order by start_at desc limit 50", [user.email ?? ""]),
  ]);
  const p = (profile[0] as Record<string, unknown> | undefined) ?? {};
  return NextResponse.json({
    ok: true,
    user: { email: user.email },
    profile: { name: p.name ?? "", position: p.position ?? "", company: p.company ?? "", newsletter: sub.length ? !(sub[0] as { unsubscribed: boolean }).unsubscribed : false },
    bookmarks,
    purchases,
    downloads,
    views,
    calls,
  });
}

/** Settings: name, position, company (used to pre-fill comments), newsletter on/off. */
export async function PUT(req: Request) {
  const user = await getUser(req);
  if (!user) return error(401, "signed_out", "Sign in first.");
  const b = await readJson<Record<string, unknown>>(req);
  if (!b) return error(400, "invalid", "Bad request");
  const newsletter = b.newsletter === true;
  await q(
    `insert into mb.profiles (user_id, name, position, company, newsletter, updated_at) values ($1,$2,$3,$4,$5, now())
     on conflict (user_id) do update set name = $2, position = $3, company = $4, newsletter = $5, updated_at = now()`,
    [user.id, clean(b.name, 60), clean(b.position, 60), clean(b.company, 60), newsletter],
  );
  if (user.email) {
    await q(
      `insert into mb.subscribers (email, source, unsubscribed) values (lower($1), 'account', $2)
       on conflict (email) do update set unsubscribed = $2`,
      [user.email, !newsletter],
    );
    if (newsletter) void addToNewsletter(user.email, { SOURCE: "account" });
  }
  return NextResponse.json({ ok: true });
}
