import type { ReactNode } from "react";
import { rich } from "@/lib/text";
import type { FileType } from "@/content/types";
import { IconCheck, IconCross, IconSearch, IconFile } from "./Icons";

/*
 * UI element kit from the brand guide: drawn like real iOS / macOS UI in
 * neutral white and grey. One prop per scene, two at most.
 */

export function AppIcon({ letter, tint = "peach", size = 38 }: { letter: string; tint?: "peach" | "mint"; size?: number }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center font-bold text-ink ${tint === "peach" ? "bg-peach" : "bg-mint"}`}
      style={{ width: size, height: size, borderRadius: size * 0.26, fontSize: size * 0.42, letterSpacing: "-0.03em" }}
    >
      {letter}
    </span>
  );
}

export function Notification({
  app,
  letter,
  title,
  body,
  time = "now",
  tint = "peach",
  className = "",
}: {
  app: string;
  letter: string;
  title: string;
  body: string;
  time?: string;
  tint?: "peach" | "mint";
  className?: string;
}) {
  return (
    <div className={`card flex w-full max-w-[400px] items-start gap-3 rounded-[22px] p-3.5 pr-4 ${className}`}>
      <AppIcon letter={letter} tint={tint} />
      <div className="min-w-0 flex-1 leading-snug">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink">{app}</span>
          <span className="shrink-0 text-xs font-medium text-slate">{time}</span>
        </div>
        <p className="text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">{title}</p>
        <p className="text-[0.9375rem] tracking-[-0.01em] text-slate">{body}</p>
      </div>
    </div>
  );
}

export function SearchBar({ query, caret = true, className = "" }: { query: ReactNode; caret?: boolean; className?: string }) {
  return (
    <div className={`card flex h-[52px] w-full max-w-[420px] items-center gap-3 rounded-full px-5 ${className}`}>
      <IconSearch size={18} className="shrink-0 text-slate" />
      <span className="truncate text-[0.98rem] font-medium tracking-[-0.01em] text-ink">
        {query}
        {caret ? <span className="caret text-basil" /> : null}
      </span>
    </div>
  );
}

export function GoodBad({ bad, good, className = "" }: { bad: string; good: string; className?: string }) {
  return (
    <div className={`relative grid w-full max-w-[420px] gap-3 ${className}`}>
      <div className="card flex items-start gap-3 p-4 opacity-95">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-line text-slate" aria-label="Weak">
          <IconCross size={14} />
        </span>
        <p className="text-[0.98rem] font-medium leading-snug tracking-[-0.01em] text-slate line-through decoration-stone/60 decoration-1">
          {bad}
        </p>
      </div>
      <div className="card flex items-start gap-3 p-4 shadow-[var(--shadow-lift)]">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-basil text-cream" aria-label="Stronger">
          <IconCheck size={14} />
        </span>
        <p className="text-[0.98rem] font-semibold leading-snug tracking-[-0.015em] text-ink">{good}</p>
      </div>
    </div>
  );
}

export function FileBadge({ type, dark = false }: { type: FileType | string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[0.72rem] font-semibold tracking-[0.01em] ${
        dark ? "bg-card-dark text-cream ring-1 ring-line-dark" : "bg-paper text-ink ring-1 ring-line"
      }`}
    >
      <IconFile size={12} />
      {type}
    </span>
  );
}

export function StatProp({ value, text, className = "" }: { value: string; text: string; className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="t-num text-[clamp(5rem,12vw,9rem)]">{value}</span>
      <span className="mt-2 max-w-[18ch] text-base font-medium text-slate">{text}</span>
    </div>
  );
}

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19] w-[220px] rounded-[38px] bg-ink p-[7px] shadow-[var(--shadow-lift)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[31px] bg-paper">
        <span className="absolute left-1/2 top-2 z-10 h-[18px] w-[74px] -translate-x-1/2 rounded-full bg-ink" aria-hidden />
        {children}
      </div>
    </div>
  );
}

export function QuoteProp({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`max-w-[14ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1] tracking-[-0.04em] text-ink ${className}`}>
      {rich(text)}
    </p>
  );
}

export function CalendarSlot({ className = "" }: { className?: string }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return (
    <div className={`card w-full max-w-[360px] p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Intro call · 30 min</span>
        <span className="pill pill-tag h-6 text-xs">Free</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 text-center">
        {days.map((d, i) => (
          <span key={d} className={`rounded-lg py-1.5 text-xs font-medium ${i === 2 ? "bg-ink text-cream" : "text-slate"}`}>
            {d}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map((t, i) => (
          <span
            key={t}
            data-slot={i}
            className={`rounded-lg border py-2 text-center text-xs font-semibold ${
              i === 3 ? "border-basil bg-basil text-cream" : "border-line text-ink"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
