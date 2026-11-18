import type { ReactNode } from "react";

/** One shared text layout for Privacy, Terms, Refunds and Cookies: title, last updated, text. */
export function Legal({ title, updated, children, action }: { title: string; updated: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="shell pb-24 pt-32 md:pt-40">
      <p className="t-label mb-5">Legal</p>
      <h1 className="t-h1 text-ink">{title}</h1>
      <p className="mt-5 text-sm text-muted">Last updated {updated}</p>
      {action ? <div className="mt-6">{action}</div> : null}
      {/* OWNER REVIEW: draft text. Replace with the final legal text before launch. */}
      <div className="prose-mb mt-12 text-ink">{children}</div>
    </div>
  );
}
