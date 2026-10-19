"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { LibraryItem, LibraryKind } from "@/content/types";
import { LIBRARY_KINDS } from "@/content/library";
import { gsap } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import { useFlip } from "@/lib/useFlip";
import { useLenis } from "@/components/motion/SmoothScroll";
import { ChipGroup, EmptyState, SearchField, SelectField } from "@/components/ui/Filters";
import { AppIcon } from "@/components/ui/Props";
import { IconArrow, IconClose } from "@/components/ui/Icons";

type K = "all" | LibraryKind;
const KIND_LABEL: Record<LibraryKind, string> = { ad: "Ad", hook: "Hook", campaign: "Campaign" };

export function LibraryIndex({ items }: { items: LibraryItem[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [kind, setKind] = useState<K>("all");
  const [industry, setIndustry] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<LibraryItem | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const industries = useMemo(() => Array.from(new Set(items.map((i) => i.industry))).sort(), [items]);

  // Deep link from site search: /library?item=l03
  useEffect(() => {
    const id = params.get("item");
    if (id) setOpen(items.find((i) => i.id === id) ?? null);
  }, [params, items]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (kind === "all" || i.kind === kind) &&
        (industry === "all" || i.industry === industry) &&
        (!term || `${i.title} ${i.brand} ${i.industry} ${i.sample} ${i.ideas.join(" ")}`.toLowerCase().includes(term)),
    );
  }, [items, kind, industry, q]);

  const capture = useFlip(grid, [list.map((i) => i.id).join()]);

  useEffect(() => {
    if (q.trim().length < 3) return;
    const t = window.setTimeout(() => track({ event: "site_search", search_term: q.trim().toLowerCase() }), 900);
    return () => window.clearTimeout(t);
  }, [q]);

  const close = () => {
    setOpen(null);
    if (params.get("item")) router.replace("/library", { scroll: false });
  };

  return (
    <section className="pb-28" aria-label="Swipe file">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <ChipGroup
            label="Filter by type"
            value={kind}
            onChange={(v) => {
              capture();
              setKind(v);
            }}
            options={[{ id: "all" as K, label: "All", count: items.length }, ...LIBRARY_KINDS.map((k) => ({ id: k.id as K, label: k.label, count: items.filter((i) => i.kind === k.id).length }))]}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SelectField
              id="industry"
              label="Industry"
              value={industry}
              onChange={(v) => {
                capture();
                setIndustry(v);
              }}
              options={[{ id: "all", label: "All industries" }, ...industries.map((i) => ({ id: i, label: i }))]}
            />
            <div className="sm:w-80">
              <SearchField
                id="lib-search"
                label="Search the library"
                value={q}
                onChange={(v) => {
                  capture();
                  setQ(v);
                }}
                placeholder="Search by brand, industry or idea…"
              />
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {list.length} examples shown
        </p>

        {list.length === 0 ? (
          <div className="grid">
            <EmptyState
              onReset={() => {
                capture();
                setKind("all");
                setIndustry("all");
                setQ("");
              }}
            />
          </div>
        ) : (
          <div ref={grid} className="columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-6">
            {list.map((i) => (
              <div key={i.id} data-flip-id={i.id} className="mb-5 break-inside-avoid lg:mb-6">
                <LibraryCard item={i} onOpen={() => setOpen(i)} />
              </div>
            ))}
          </div>
        )}
      </div>
      {open ? <ItemDialog item={open} onClose={close} /> : null}
    </section>
  );
}

function Artefact({ item, large = false }: { item: LibraryItem; large?: boolean }) {
  if (item.kind === "ad") {
    return (
      <div className="card p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <AppIcon letter={item.brand.replace(/^An? /, "").charAt(0).toUpperCase()} size={30} tint="peach" />
          <span className="text-xs font-semibold leading-tight text-ink">
            {item.brand}
            <span className="block font-medium text-slate">Sponsored</span>
          </span>
        </div>
        <p className={`font-bold tracking-[-0.03em] text-ink ${large ? "text-3xl leading-[1.05]" : "text-[1.3rem] leading-[1.12]"}`}>{item.sample}</p>
        {item.sub ? <p className="mt-2 text-[0.95rem] text-slate">{item.sub}</p> : null}
      </div>
    );
  }
  if (item.kind === "hook") {
    return (
      <p className={`font-bold tracking-[-0.04em] text-ink ${large ? "text-[clamp(2rem,4vw,3rem)] leading-[1.02]" : "text-[1.6rem] leading-[1.06]"}`}>
        <span className="serif serif-basil mr-1">“</span>
        {item.sample}
      </p>
    );
  }
  return (
    <div className="tex-grid rounded-2xl border border-line bg-paper p-4">
      <span className="text-xs font-semibold text-slate">The idea</span>
      <p className={`mt-1.5 font-semibold tracking-[-0.02em] text-ink ${large ? "text-2xl leading-snug" : "text-[1.1rem] leading-snug"}`}>{item.sample}</p>
    </div>
  );
}

function LibraryCard({ item, onOpen }: { item: LibraryItem; onOpen: () => void }) {
  return (
    <article className="group card lift relative flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <span className="pill pill-plain">{KIND_LABEL[item.kind]}</span>
        <span className="text-xs font-medium text-slate">{item.industry}</span>
      </div>
      <Artefact item={item} />
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[1.05rem] font-semibold tracking-[-0.015em] text-ink">{item.title}</h2>
          <p className="text-sm text-slate">{item.brand}</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-basil after:absolute after:inset-0 after:content-['']"
          aria-label={`Why it works: ${item.title}`}
        >
          Why it works <IconArrow size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

function ItemDialog({ item, onClose }: { item: LibraryItem; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onClose = () => closeRef.current();
    const prev = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    if (panel.current) gsap.fromTo(panel.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep focus inside the dialog.
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [item, lenis]);

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center bg-ink/35 p-3 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lib-dialog-title"
        className="relative isolate max-h-[90svh] w-full max-w-[720px] overflow-y-auto rounded-[28px] bg-paper p-6 shadow-[var(--shadow-lift)] sm:p-10"
        data-lenis-prevent
      >
        <span className="glow glow-mint -z-10" style={{ width: "600px", left: "-260px", bottom: "-360px" }} />
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill pill-plain">{KIND_LABEL[item.kind]}</span>
            <span className="pill pill-plain">{item.industry}</span>
          </div>
          <button ref={closeBtn} type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white ring-1 ring-line hover:bg-ink/5" aria-label="Close">
            <IconClose size={20} />
          </button>
        </div>
        <h2 id="lib-dialog-title" className="mt-6 text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
          {item.title}
        </h2>
        <p className="mt-1 text-slate">{item.brand}</p>
        <div className="mt-8">
          <Artefact item={item} large />
        </div>
        <div className="mt-8 rounded-[20px] bg-mint/70 p-6">
          <p className="font-semibold text-basil">Why it works</p>
          <p className="mt-1.5 text-lg leading-relaxed text-ink">{item.why}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {item.ideas.map((i) => (
            <span key={i} className="pill pill-plain">
              {i}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate">Illustrative example, {item.year}.</p>
      </div>
    </div>
  );
}
