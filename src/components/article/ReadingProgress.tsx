"use client";
import { useEffect, useRef } from "react";

/** Thin reading-progress line under the capsule navbar (blog posts). */
export function ReadingProgress({ target = "article-body" }: { target?: string }) {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (!el || !bar.current) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
        bar.current.style.transform = `scaleX(${p})`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [target]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-3 top-[74px] z-[99]">
      <div className="mx-auto max-w-[1180px] px-6">
        <span ref={bar} className="block h-0.5 origin-left rounded-full bg-violet" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
