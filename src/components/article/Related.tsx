import type { ReactNode } from "react";

/** "Related reads" row at the end of every detail page. */
export function Related({ title, children }: { title: string; children: ReactNode[] }) {
  if (!children.length) return null;
  return (
    <section className="tex-squares border-t border-line" aria-labelledby="related-title">
      <div className="shell section">
        <h2 id="related-title" className="t-h1 text-ink">
          {title}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
      </div>
    </section>
  );
}

/** Picks up to n related items: same group first, then the newest others. */
export function pickRelated<T extends { slug: string; date: string }>(all: T[], current: T, same: (x: T) => boolean, n = 3) {
  const others = all.filter((x) => x.slug !== current.slug).sort((a, b) => b.date.localeCompare(a.date));
  return [...others.filter(same), ...others.filter((x) => !same(x))].slice(0, n);
}
