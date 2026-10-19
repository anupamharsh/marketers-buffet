"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { toast } from "@/components/ui/Toaster";
import { IconLink, IconLinkedIn, IconWhatsApp, IconX } from "@/components/ui/Icons";

/** Reading progress bar + fires post_read once the reader passes 75% of the article. */
export function ReadingProgress({ targetId, title, format }: { targetId: string; title: string; format: string }) {
  const bar = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (!fired.current && p >= 0.75) {
        fired.current = true;
        track({ event: "post_read", post_title: title, format });
      }
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [targetId, title, format]);

  return (
    <div className="fixed inset-x-0 top-0 z-[105] h-[3px]" aria-hidden>
      <span ref={bar} className="block h-full origin-left scale-x-0 bg-basil" />
    </div>
  );
}

/** Auto table of contents from the post's h2s. Sticky on desktop, highlights the active section. */
export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="On this page">
      <p className="mb-4 text-sm font-semibold text-ink">On this page</p>
      <ol className="grid gap-0.5 border-l border-line">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={`-ml-px flex min-h-10 items-center border-l-2 py-1.5 pl-4 text-[0.95rem] leading-snug transition-colors ${
                active === i.id ? "border-basil font-semibold text-ink" : "border-transparent text-slate hover:text-ink"
              }`}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Share({ title, path }: { title: string; path: string }) {
  // Resolve the absolute URL after mount so server and client markup match.
  const [full, setFull] = useState(path);
  useEffect(() => setFull(window.location.origin + path), [path]);
  const url = () => full;
  const enc = (s: string) => encodeURIComponent(s);
  const btn = "grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink/30";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="mr-2 text-lg font-bold tracking-[-0.025em] text-ink">Pass it on.</p>
      <button
        type="button"
        className={btn}
        aria-label="Copy link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            toast("Link copied. Go share something good.");
          } catch {
            toast("Couldn't copy. Try the address bar.");
          }
        }}
      >
        <IconLink size={18} />
      </button>
      <a className={btn} aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url())}`}>
        <IconLinkedIn size={18} />
      </a>
      <a className={btn} aria-label="Share on X" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?text=${enc(title)}&url=${enc(url())}`}>
        <IconX size={16} />
      </a>
      <a className={btn} aria-label="Share on WhatsApp" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${enc(`${title} ${url()}`)}`}>
        <IconWhatsApp size={18} />
      </a>
    </div>
  );
}
