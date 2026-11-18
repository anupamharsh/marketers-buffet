"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/text";
import type { Kind } from "@/content/types";

type C = { id: string; name: string; position: string | null; company: string | null; body: string; created_at: string };

/**
 * Comments (handoff): name, position, company, comment; auto-filled when
 * signed in. Every comment waits for admin approval before it shows.
 * Spam protection: Turnstile, 5 per hour per IP and device, a hidden
 * honeypot field and a one-link limit on the server.
 */
export function Comments({ kind, slug }: { kind: Exclude<Kind, "templates">; slug: string }) {
  const id = useId();
  const { session, api } = useAuth();
  const ts = useRef<TurnstileHandle>(null);
  const [list, setList] = useState<C[] | null>(null);
  const [f, setF] = useState({ name: "", position: "", company: "", body: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?kind=${kind}&slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : { comments: [] }))
      .then((d: { comments: C[] }) => setList(d.comments))
      .catch(() => setList([]));
  }, [kind, slug]);

  // Pre-fill from Account › Settings when signed in.
  useEffect(() => {
    if (!session) return;
    api("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { profile?: { name: string; position: string; company: string } } | null) => {
        if (!d?.profile) return;
        setF((v) => ({ ...v, name: v.name || d.profile!.name, position: v.position || d.profile!.position, company: v.company || d.profile!.company }));
      })
      .catch(() => {});
  }, [session, api]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return setErr("Add your name so people know who's talking.");
    if (f.body.trim().length < 2) return setErr("Write a little more so others know what you mean.");
    setState("sending");
    setErr(null);
    try {
      const r = await api("/api/comments", { method: "POST", body: JSON.stringify({ kind, slug, ...f, token: ts.current?.token() }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.message || "Something broke on our end. Try again in a moment.");
      setState("done");
    } catch (x) {
      setState("idle");
      setErr((x as Error).message);
      ts.current?.reset();
    }
  }

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    setF((v) => ({ ...v, [k]: e.target.value }));
    setErr(null);
  };

  return (
    <section aria-labelledby={`${id}-h`} className="mt-20">
      <h2 id={`${id}-h`} className="t-h3 text-[1.6rem] text-ink">
        Comments{list && list.length ? <span className="text-muted"> · {list.length}</span> : null}
      </h2>

      {list === null ? (
        <p className="mt-4 text-muted">Loading comments…</p>
      ) : list.length === 0 ? (
        <p className="mt-4 text-muted">No comments yet. Start the conversation.</p>
      ) : (
        <ol className="mt-6 grid gap-3">
          {list.map((c) => (
            <li key={c.id} className="rounded-[18px] border border-line bg-surface p-5">
              <p className="flex flex-wrap items-baseline gap-x-2 text-[0.95rem]">
                <span className="font-semibold text-ink">{c.name}</span>
                {c.position || c.company ? <span className="text-muted">{[c.position, c.company].filter(Boolean).join(" · ")}</span> : null}
                <span className="ml-auto text-xs text-muted">{formatDate(c.created_at)}</span>
              </p>
              <p className="mt-2 whitespace-pre-line break-words leading-relaxed text-ink">{c.body}</p>
            </li>
          ))}
        </ol>
      )}

      {state === "done" ? (
        <p role="status" className="mt-8 flex items-center gap-2.5 rounded-[18px] border border-line bg-surface p-5 font-medium text-ink">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lilac text-indigo">
            <Icon name="check" size={15} />
          </span>
          Thanks. Your comment will show here once it&apos;s approved.
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 grid gap-3 rounded-[22px] border border-line bg-surface p-5 sm:p-6">
          <p className="font-semibold text-ink">Add a comment</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              Name
              <input className="field" value={f.name} onChange={set("name")} maxLength={60} autoComplete="name" required />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              Position <span className="sr-only">(optional)</span>
              <input className="field" value={f.position} onChange={set("position")} maxLength={60} autoComplete="organization-title" placeholder="Optional" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              Company <span className="sr-only">(optional)</span>
              <input className="field" value={f.company} onChange={set("company")} maxLength={60} autoComplete="organization" placeholder="Optional" />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-medium text-ink">
            Comment
            <textarea className="field" value={f.body} onChange={set("body")} maxLength={2000} rows={4} required />
          </label>
          {/* Honeypot: hidden from people, bots tend to fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
            </label>
          </div>
          <Turnstile ref={ts} />
          {err ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {err}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">Comments are checked before they go live.</p>
            <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Post comment"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
