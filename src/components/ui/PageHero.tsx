import type { ReactNode } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Glows } from "./Art";
import type { Glow } from "@/content/types";

/** Inner-page hero: series pill, sans + serif headline, one lead line, glow + texture. */
export function PageHero({
  label,
  title,
  line,
  glow = "both",
  texture = "tex-dots",
  children,
}: {
  label?: string;
  title: string;
  line?: string;
  glow?: Glow;
  texture?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
      <div className="mask-fade-b pointer-events-none absolute inset-0 -z-10">
        <Glows glow={glow} />
      </div>
      <div className={`${texture} mask-fade-b pointer-events-none absolute inset-0 -z-10`} />
      <div className="shell">
        {label ? (
          <Reveal>
            <span className="pill pill-series mb-8">{label}</span>
          </Reveal>
        ) : null}
        <RevealText as="h1" mode="load" text={title} className="t-h1 max-w-[16ch] text-ink" />
        {line ? (
          <Reveal delay={0.2}>
            <p className="t-lead mt-6 max-w-[38rem]">{line}</p>
          </Reveal>
        ) : null}
        {children ? (
          <Reveal delay={0.3} className="mt-10">
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
