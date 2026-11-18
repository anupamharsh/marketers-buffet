"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/content";
import { track } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";

export const OPEN_SEARCH = "mb:search";
export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH));

/** Search panel across blogs, automations, AI edge pages and templates. Ctrl/⌘ + K. */
export function SearchPanel({ index }: { index: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const last = useRef<HTMLElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener(OPEN_SEARCH, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      last.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => input.current?.focus());
    } else {
      document.body.style.overflow = "";
      last.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    if (!open || q.trim().length < 3) return;
    const t = window.setTimeout(() => track({ event: "site_search", search_term: q.trim().toLowerCase() }), 900);
    return () => window.clearTimeout(t);
  }, [q, open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return index.slice(0, 8);
    const words = term.split(/\s+/);
    return index
      .map((i) => {
        const hay = `${i.title} ${i.sub} ${i.keywords}`.toLowerCase();
        const score = words.reduce((s, w) => s + (hay.includes(w) ? (i.title.toLowerCase().includes(w) ? 3 : 1) : -10), 0);
        return { i, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.i);
  }, [q, index]);

  useEffect(() => setActive(0), [q]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActive((a) => Math.min(a + 1, results.length - 1));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActive((a) => Math.max(a - 1, 0));
        }
        if (e.key === "Enter" && results[active]) {
          e.preventDefault();
          go(results[active].href);
        }
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Search" className="w-full max-w-[640px] overflow-hidden rounded-[24px] border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Icon name="search" size={20} className="text-muted" />
          <label htmlFor="mb-search" className="sr-only">
            Search blogs, automations, AI edge and templates
          </label>
          <input
            ref={input}
            id="mb-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search blogs, automations, AI and templates…"
            className="h-16 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded="true"
            aria-controls="mb-search-results"
            aria-activedescendant={results[active] ? `mb-r-${active}` : undefined}
            autoComplete="off"
          />
          <button onClick={() => setOpen(false)} className="icon-btn border-transparent" aria-label="Close search">
            <Icon name="x" size={18} />
          </button>
        </div>
        <ul id="mb-search-results" role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-4 py-10 text-center text-muted">Nothing here yet. Try another word.</li>
          ) : (
            results.map((r, i) => (
              <li key={r.href} id={`mb-r-${i}`} role="option" aria-selected={i === active}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.href)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors duration-[160ms] ${i === active ? "bg-ink/[0.05]" : ""}`}
                >
                  <span className="w-[5.5rem] shrink-0 text-xs font-semibold text-muted">{r.label}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{r.title}</span>
                    <span className="block truncate text-sm text-muted">{r.sub}</span>
                  </span>
                  <Icon name="arrow-right" size={16} className={i === active ? "text-ink" : "text-transparent"} />
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex justify-between border-t border-line px-5 py-3 text-xs font-medium text-muted">
          <span>↑ ↓ to move · Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
