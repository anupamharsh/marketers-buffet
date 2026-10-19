"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import { useLenis } from "@/components/motion/SmoothScroll";
import { IconArrow, IconClose, IconSearch } from "@/components/ui/Icons";

export type SearchItem = { kind: "Post" | "Template" | "Library"; title: string; sub: string; href: string; keywords: string };

export const OPEN_SEARCH = "mb:search";
export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH));

/** Site-wide search across posts, templates and the library. Ctrl/⌘ + K. */
export function SearchOverlay({ index }: { index: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const lenis = useLenis();

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
      lastFocus.current = document.activeElement as HTMLElement;
      lenis?.stop();
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => input.current?.focus());
      if (panel.current) gsap.fromTo(panel.current, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 });
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      lastFocus.current?.focus?.();
    }
  }, [open, lenis]);

  // Report the search term once the visitor pauses typing.
  useEffect(() => {
    if (!open || q.trim().length < 3) return;
    const t = window.setTimeout(() => track({ event: "site_search", search_term: q.trim().toLowerCase() }), 900);
    return () => window.clearTimeout(t);
  }, [q, open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return index.filter((i) => i.kind !== "Library").slice(0, 6);
    const words = term.split(/\s+/);
    return index
      .map((i) => {
        const hay = `${i.title} ${i.sub} ${i.keywords}`.toLowerCase();
        const score = words.reduce((s, w) => s + (hay.includes(w) ? (i.title.toLowerCase().includes(w) ? 3 : 1) : -10), 0);
        return { i, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
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
      className="fixed inset-0 z-[150] flex items-start justify-center bg-ink/30 px-4 pt-[12vh]"
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
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="card w-full max-w-[640px] overflow-hidden !rounded-[26px] shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <IconSearch size={20} className="text-slate" />
          <label htmlFor="mb-search" className="sr-only">
            Search posts, templates and the library
          </label>
          <input
            ref={input}
            id="mb-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by topic, brand or idea…"
            className="h-16 flex-1 bg-transparent text-lg font-medium tracking-[-0.01em] text-ink outline-none placeholder:text-[#6b6760]"
            role="combobox"
            aria-expanded="true"
            aria-controls="mb-search-results"
            aria-activedescendant={results[active] ? `mb-r-${active}` : undefined}
            autoComplete="off"
          />
          <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Close search">
            <IconClose size={20} />
          </button>
        </div>
        <ul id="mb-search-results" role="listbox" className="max-h-[52vh] overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 ? (
            <li className="px-4 py-10 text-center text-slate">Nothing here yet. Try another word, or browse everything.</li>
          ) : (
            results.map((r, i) => (
              <li key={r.href + i} id={`mb-r-${i}`} role="option" aria-selected={i === active}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.href)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors ${i === active ? "bg-paper" : ""}`}
                >
                  <span className="w-[4.5rem] shrink-0 text-xs font-semibold text-slate">{r.kind}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold tracking-[-0.015em] text-ink">{r.title}</span>
                    <span className="block truncate text-sm text-slate">{r.sub}</span>
                  </span>
                  <IconArrow size={16} className={`shrink-0 text-basil transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} />
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs font-medium text-slate">
          <span>↑ ↓ to move · Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
