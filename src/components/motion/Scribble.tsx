"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Kind = "circle" | "strike" | "underline" | "arrow";

const PATHS: Record<Kind, { d: string; viewBox: string; box: string }> = {
  circle: {
    viewBox: "0 0 200 80",
    d: "M118 9C70 5 18 15 9 38c-8 22 40 36 96 36 54 0 90-14 88-36C190 14 134 2 70 10",
    box: "-left-[9%] -right-[9%] -top-[22%] -bottom-[18%]",
  },
  strike: {
    viewBox: "0 0 200 24",
    d: "M3 15C46 9 98 14 140 10c22-2 40-2 57-5",
    box: "left-[-3%] right-[-3%] top-[38%] h-[30%]",
  },
  underline: {
    viewBox: "0 0 200 20",
    d: "M3 12C55 6 120 9 197 5",
    box: "left-0 right-0 -bottom-[14%] h-[26%]",
  },
  arrow: {
    viewBox: "0 0 120 80",
    d: "M6 10c30 2 70 18 92 54m0 0-2-22m2 22-20-8",
    box: "-right-[60%] top-[30%] w-[55%] h-[90%]",
  },
};

/**
 * Hand-drawn 2px pen mark (brand signature move #3). Max one per scene.
 * Draws itself when scrolled into view unless `manual` is set, in which case
 * a parent timeline animates `[data-scribble]` stroke-dashoffset 1 → 0.
 */
export function Scribble({
  children,
  kind = "circle",
  tone = "basil",
  manual = false,
  className = "",
  delay = 0.2,
}: {
  children: ReactNode;
  kind?: Kind;
  tone?: "basil" | "ink" | "mint";
  manual?: boolean;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const p = PATHS[kind];
  const color = tone === "basil" ? "#1E4D3E" : tone === "mint" ? "#D6F2E6" : "#141414";

  useGSAP(
    () => {
      const path = ref.current?.querySelector("[data-scribble]");
      if (!path) return;
      const mm = gsap.matchMedia();
      // Manual scribbles are drawn by a parent timeline; show them fully when motion is reduced.
      mm.add(MQ.reduce, () => {
        gsap.set(path, { strokeDashoffset: 0 });
      });
      if (manual) return () => mm.revert();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1,
            delay,
            ease: "power2.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <span className={`pointer-events-none absolute ${p.box}`} aria-hidden>
      <svg className="h-full w-full" viewBox={p.viewBox} preserveAspectRatio="none" overflow="visible">
        <path
          data-scribble
          d={p.d}
          fill="none"
          stroke={color}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={manual ? 1 : 0}
        />
      </svg>
      </span>
    </span>
  );
}
