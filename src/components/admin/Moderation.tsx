"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { KIND_PATH } from "@/content";
import type { Kind } from "@/content/types";
import { formatDate } from "@/lib/text";
import { toast } from "@/components/ui/Toaster";

type C = { id: string; kind: Kind; slug: string; name: string; position: string | null; company: string | null; body: string; status: string; created_at: string };
const STATUSES = ["pending", "approved", "rejected"] as const;

/** Comment approval queue. Access is checked on the server (ADMIN_EMAILS). */
export function Moderation() {
  const { session, ready, api } = useAuth();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("pending");
  const [list, setList] = useState<C[] | null>(null);
  const [denied, setDenied] = useState(false);

  const load = useCallback(() => {
    if (!session) return;
    setList(null);
    api(`/api/admin/comments?status=${status}`)
      .then(async (r) => {
        if (r.status === 403) return setDenied(true);
        const d = await r.json();
        setList(d.comments ?? []);
      })
      .catch(() => setList([]));
  }, [session, api, status]);
  useEffect(load, [load]);

  async function act(id: string, action: "approve" | "reject" | "delete" | "block") {
    if ((action === "delete" || action === "block") && !window.confirm(action === "block" ? "Block this commenter from all forms and reject their pending comments?" : "Delete this comment for good?")) return;
    const r = await api("/api/admin/comments", { method: "POST", body: JSON.stringify({ id, action }) });
    if (!r.ok) return toast("That didn't work. Try again.");
    setList((l) => (l ? l.filter((c) => c.id !== id) : l));
    toast({ approve: "Approved. It's live.", reject: "Rejected.", delete: "Deleted.", block: "Blocked." }[action]);
  }

  if (!ready) return <p className="text-muted">Loading…</p>;
  if (!session)
    return (
      <p className="text-muted">
        <Link href="/signin?next=/admin" className="underline underline-offset-2">
          Sign in
        </Link>{" "}
        with an admin email.
      </p>
    );
  if (denied) return <p className="text-muted">This account isn&apos;t an admin.</p>;

  return (
    <div>
      <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button key={s} type="button" className="chip capitalize" aria-pressed={status === s} onClick={() => setStatus(s)}>
            {s}
          </button>
        ))}
      </div>
      {list === null ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : list.length === 0 ? (
        <p className="mt-8 rounded-[22px] border border-line bg-surface p-8 text-center text-muted">Nothing {status}.</p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {list.map((c) => (
            <li key={c.id} className="rounded-[18px] border border-line bg-surface p-5">
              <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-muted">{[c.position, c.company].filter(Boolean).join(" · ")}</span>
                <span className="ml-auto text-muted">{formatDate(c.created_at)}</span>
              </p>
              <p className="mt-1 text-xs">
                <Link href={`${KIND_PATH[c.kind]}/${c.slug}`} className="link text-muted" target="_blank">
                  {KIND_PATH[c.kind]}/{c.slug}
                </Link>
              </p>
              <p className="mt-3 whitespace-pre-line break-words text-ink">{c.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.status !== "approved" ? (
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => act(c.id, "approve")}>
                    Approve
                  </button>
                ) : null}
                {c.status !== "rejected" ? (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => act(c.id, "reject")}>
                    {c.status === "approved" ? "Hide" : "Reject"}
                  </button>
                ) : null}
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => act(c.id, "delete")}>
                  Delete
                </button>
                <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => act(c.id, "block")}>
                  Block commenter
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
