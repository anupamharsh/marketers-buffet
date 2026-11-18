"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { authConfigured } from "@/lib/supabase-browser";
import { findItem } from "@/content";
import { formatPrice, getTemplate } from "@/content/templates";
import type { Kind } from "@/content/types";
import { formatDate } from "@/lib/text";
import { Icon } from "@/components/ui/Icon";
import { toast } from "@/components/ui/Toaster";

type Me = {
  user: { email: string | null };
  profile: { name: string; position: string; company: string; newsletter: boolean };
  bookmarks: { kind: Kind; slug: string; created_at: string }[];
  purchases: { template_slug: string; amount: number; paid_at: string; razorpay_order_id: string }[];
  downloads: { template_slug: string; created_at: string }[];
  views: { kind: Kind; slug: string; viewed_at: string }[];
  calls: { uid: string; title: string | null; start_at: string | null; end_at: string | null; status: string }[];
};

const TABS = [
  { id: "saved", label: "Saved" },
  { id: "purchases", label: "My purchases" },
  { id: "downloads", label: "My downloads" },
  { id: "calls", label: "My calls" },
  { id: "viewed", label: "Recently viewed" },
  { id: "settings", label: "Settings" },
] as const;
type Tab = (typeof TABS)[number]["id"];

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[22px] border border-line bg-surface p-8 text-center text-muted">{children}</p>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <li className="flex flex-wrap items-center gap-3 rounded-[18px] border border-line bg-surface p-4">{children}</li>;
}

const time = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

export function Account() {
  const router = useRouter();
  const { session, ready, api, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("saved");
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t && TABS.some((x) => x.id === t)) setTab(t as Tab);
  }, []);

  useEffect(() => {
    if (ready && !session && authConfigured()) router.replace("/signin?next=/account");
  }, [ready, session, router]);

  const load = useCallback(() => {
    if (!session) return;
    api("/api/me")
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.message || "Couldn't load your account.");
        setMe(d as Me);
      })
      .catch((x) => setErr((x as Error).message));
  }, [session, api]);
  useEffect(load, [load]);

  const pick = (t: Tab) => {
    setTab(t);
    window.history.replaceState(null, "", `/account?tab=${t}`);
  };

  async function redownload(slug: string) {
    const r = await api("/api/me/download", { method: "POST", body: JSON.stringify({ slug }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.links?.length) return toast(d.message || "Couldn't get the file. Try again.");
    window.location.assign(d.links[0].url);
  }

  if (!authConfigured()) return <Empty>Accounts aren&apos;t switched on yet. Check back soon.</Empty>;
  if (!ready || !session) return <p className="text-muted">Loading…</p>;

  const now = Date.now();
  const calls = me?.calls ?? [];
  const upcoming = calls.filter((c) => c.start_at && new Date(c.start_at).getTime() >= now).reverse();
  const past = calls.filter((c) => !c.start_at || new Date(c.start_at).getTime() < now);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted">
          Signed in as <span className="font-semibold text-ink">{session.user.email}</span>
        </p>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={async () => {
            await signOut();
            router.replace("/");
          }}
        >
          Sign out
        </button>
      </div>

      <div role="tablist" aria-label="Account sections" className="no-scrollbar -mx-1 mt-8 flex gap-2 overflow-x-auto px-1 py-1">
        {TABS.map((t) => (
          <button key={t.id} id={`tab-${t.id}`} role="tab" type="button" aria-selected={tab === t.id} aria-controls="account-panel" aria-pressed={tab === t.id} className="chip shrink-0" onClick={() => pick(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div id="account-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-8">
        {err ? (
          <Empty>{err}</Empty>
        ) : !me ? (
          <p className="text-muted">Loading…</p>
        ) : tab === "saved" ? (
          <ItemList items={me.bookmarks.map((b) => ({ kind: b.kind, slug: b.slug, at: b.created_at }))} empty="Nothing saved yet. Tap the bookmark on any card to keep it here." />
        ) : tab === "viewed" ? (
          <ItemList items={me.views.map((v) => ({ kind: v.kind, slug: v.slug, at: v.viewed_at }))} empty="Pages you read while signed in show up here." />
        ) : tab === "purchases" ? (
          me.purchases.length ? (
            <ul className="grid gap-3">
              {me.purchases.map((p) => {
                const t = getTemplate(p.template_slug);
                return (
                  <Row key={p.razorpay_order_id}>
                    <span className="min-w-0 flex-1">
                      <Link href={`/templates/${p.template_slug}`} className="link font-semibold text-ink">
                        {t?.name ?? p.template_slug}
                      </Link>
                      <span className="block text-sm text-muted">
                        {formatPrice(p.amount / 100)} · {p.paid_at ? formatDate(p.paid_at) : ""} · Order {p.razorpay_order_id}
                      </span>
                    </span>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => redownload(p.template_slug)}>
                      Download
                    </button>
                  </Row>
                );
              })}
            </ul>
          ) : (
            <Empty>
              No purchases yet. <Link href="/templates" className="underline underline-offset-2">Browse templates</Link>.
            </Empty>
          )
        ) : tab === "downloads" ? (
          me.downloads.length ? (
            <ul className="grid gap-3">
              {me.downloads.map((d, i) => {
                const t = getTemplate(d.template_slug);
                return (
                  <Row key={`${d.template_slug}-${i}`}>
                    <span className="min-w-0 flex-1">
                      <Link href={`/templates/${d.template_slug}`} className="link font-semibold text-ink">
                        {t?.name ?? d.template_slug}
                      </Link>
                      <span className="block text-sm text-muted">{formatDate(d.created_at)}</span>
                    </span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => redownload(d.template_slug)}>
                      Download again
                    </button>
                  </Row>
                );
              })}
            </ul>
          ) : (
            <Empty>Free templates you download show up here.</Empty>
          )
        ) : tab === "calls" ? (
          calls.length ? (
            <div className="grid gap-8">
              {[
                { h: "Upcoming", list: upcoming },
                { h: "Past", list: past },
              ].map((g) =>
                g.list.length ? (
                  <section key={g.h}>
                    <h2 className="t-label mb-3">{g.h}</h2>
                    <ul className="grid gap-3">
                      {g.list.map((c) => (
                        <Row key={c.uid}>
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-lilac-soft text-indigo">
                            <Icon name="user" size={18} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-ink">{c.title || "Call"}</span>
                            <span className="block text-sm text-muted">{c.start_at ? `${formatDate(c.start_at)} · ${time(c.start_at)}` : "Time to be confirmed"}</span>
                          </span>
                        </Row>
                      ))}
                    </ul>
                  </section>
                ) : null,
              )}
            </div>
          ) : (
            <Empty>
              No calls yet. <Link href="/book-a-call" className="underline underline-offset-2">Book a free intro call</Link>. Book with this email and it shows here.
            </Empty>
          )
        ) : (
          <Settings me={me} onSaved={load} />
        )}
      </div>
    </div>
  );
}

function ItemList({ items, empty }: { items: { kind: Kind; slug: string; at: string }[]; empty: string }) {
  const rows = items.map((i) => ({ ...i, item: findItem(i.kind, i.slug) })).filter((i) => i.item);
  if (!rows.length) return <Empty>{empty}</Empty>;
  return (
    <ul className="grid gap-3">
      {rows.map((r) => (
        <Row key={`${r.kind}:${r.slug}`}>
          <span className="pill pill-lilac">{r.item!.label}</span>
          <span className="min-w-0 flex-1">
            <Link href={r.item!.href} className="link font-semibold text-ink">
              {r.item!.title}
            </Link>
            <span className="block truncate text-sm text-muted">{r.item!.sub}</span>
          </span>
          <span className="text-xs text-muted">{formatDate(r.at)}</span>
        </Row>
      ))}
    </ul>
  );
}

function Settings({ me, onSaved }: { me: Me; onSaved: () => void }) {
  const { api } = useAuth();
  const [f, setF] = useState(me.profile);
  const [busy, setBusy] = useState(false);
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api("/api/me", { method: "PUT", body: JSON.stringify(f) });
    setBusy(false);
    if (!r.ok) return toast("Couldn't save. Try again.");
    toast("Saved.");
    onSaved();
  }
  return (
    <form onSubmit={save} className="grid max-w-xl gap-4 rounded-[22px] border border-line bg-surface p-6">
      <p className="text-sm text-muted">Used to fill in your comments automatically.</p>
      {(["name", "position", "company"] as const).map((k) => (
        <label key={k} className="grid gap-1.5 text-sm font-medium capitalize text-ink">
          {k}
          <input className="field" value={f[k]} maxLength={60} onChange={(e) => setF({ ...f, [k]: e.target.value })} autoComplete={k === "name" ? "name" : k === "company" ? "organization" : "organization-title"} />
        </label>
      ))}
      <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line px-4 py-2.5">
        <span>
          <span className="block text-sm font-semibold text-ink">Newsletter</span>
          <span className="block text-xs text-muted">What moved in marketing, every two weeks.</span>
        </span>
        <input type="checkbox" role="switch" checked={f.newsletter} onChange={(e) => setF({ ...f, newsletter: e.target.checked })} className="h-5 w-5 accent-[#1a0b4b]" />
      </label>
      <button type="submit" className="btn btn-primary justify-self-start" disabled={busy}>
        {busy ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
