"use client";
import Image from "next/image";
import { useId, useState } from "react";

type Side = { src?: string; alt: string; label?: string };

function Pane({ side, tone }: { side: Side; tone: "indigo" | "lilac" }) {
  if (side.src) return <Image src={side.src} alt={side.alt} fill sizes="(min-width: 768px) 44rem, 100vw" className="object-cover" />;
  // Placeholder until the owner adds the real images.
  return (
    <div className={`pat grain pat-${tone} absolute inset-0 grid place-items-center p-6 text-center`} data-shape={tone === "indigo" ? "dots" : "lines"}>
      <span className={`relative z-[1] text-sm font-medium ${tone === "indigo" ? "text-offwhite" : "text-indigo"}`}>{side.alt}</span>
    </div>
  );
}

/**
 * Before/after slider. A native range input drives it, so it works with
 * keyboard (arrow keys) and screen readers. No animation.
 */
export function BeforeAfter({ before, after }: { before: Side; after: Side }) {
  const id = useId();
  const [pos, setPos] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-line bg-surface">
        <Pane side={after} tone="lilac" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Pane side={before} tone="indigo" />
        </div>
        <span aria-hidden className="absolute inset-y-0 w-0.5 bg-offwhite shadow-[0_0_0_1px_rgb(26_11_75/0.3)]" style={{ left: `calc(${pos}% - 1px)` }}>
          <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-offwhite text-indigo shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6l6 6M15 6l6 6l-6 6" />
            </svg>
          </span>
        </span>
        <span className="pill absolute left-3 top-3 bg-indigo text-offwhite">{before.label ?? "Before"}</span>
        <span className="pill absolute right-3 top-3 bg-lilac text-indigo">{after.label ?? "After"}</span>
        <label htmlFor={id} className="sr-only">
          Drag to compare before and after
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-2 text-sm text-muted">
        {before.alt} → {after.alt}
      </figcaption>
    </figure>
  );
}
