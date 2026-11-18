"use client";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";

export type GridItem = { id: string; facets: string[]; text: string; node: ReactNode };

/**
 * Filter chips (+ optional search) over a grid of server-rendered cards.
 * The full list is in the HTML for search engines; filtering happens in the
 * browser. The active filter is kept in the URL (?{param}=…) so it can be shared.
 */
export function FilterGrid({
  items,
  filters,
  param,
  label,
  searchable = false,
  searchLabel = "Search",
  featured,
  featuredId,
  empty = "Nothing here yet. Try another filter.",
}: {
  items: GridItem[];
  filters: { value: string; label: ReactNode }[];
  param: string;
  label: string;
  searchable?: boolean;
  searchLabel?: string;
  /** Shown above the grid only when no filter or search is active. */
  featured?: ReactNode;
  /** Grid item hidden while the featured card is showing (so it isn't listed twice). */
  featuredId?: string;
  empty?: string;
}) {
  const id = useId();
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get(param);
    if (v && filters.some((f) => f.value === v)) setActive(v);
  }, [param, filters]);

  const pick = (v: string) => {
    setActive(v);
    const u = new URL(window.location.href);
    if (v === "all") u.searchParams.delete(param);
    else u.searchParams.set(param, v);
    window.history.replaceState(null, "", u.pathname + u.search);
  };

  const q = query.trim().toLowerCase();
  const clean = active === "all" && !q;
  const shown = useMemo(
    () =>
      items.filter(
        (i) => (active === "all" || i.facets.includes(active)) && (!q || i.text.toLowerCase().includes(q)) && !(clean && featured && i.id === featuredId),
      ),
    [items, active, q, clean, featured, featuredId],
  );

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label={label} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
          {[{ value: "all", label: "All" }, ...filters].map((f) => (
            <button key={f.value} type="button" className="chip shrink-0" aria-pressed={active === f.value} onClick={() => pick(f.value)}>
              {f.label}
            </button>
          ))}
        </div>
        {searchable ? (
          <div className="relative md:w-72">
            <label htmlFor={`${id}-q`} className="sr-only">
              {searchLabel}
            </label>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" size={16} />
            </span>
            <input
              id={`${id}-q`}
              type="search"
              className="field !rounded-full pl-10"
              placeholder={searchLabel}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => q && track({ event: "site_search", search_term: q.slice(0, 80) })}
            />
          </div>
        ) : null}
      </div>

      {clean && featured ? <div className="mt-10">{featured}</div> : null}

      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "result" : "results"}
      </p>
      {shown.length ? (
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((i) => (
            <li key={i.id}>{i.node}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-[22px] border border-line bg-surface p-8 text-center text-muted">{empty}</p>
      )}
    </>
  );
}
