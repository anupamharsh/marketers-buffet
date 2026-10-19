"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { RevealText } from "@/components/motion/RevealText";
import { Cloche } from "@/components/brand/Cloche";

const STACK = [
  { k: "A lesson", v: "Good isn't a reason to act today." },
  { k: "A teardown", v: "The rain-delay notification." },
  { k: "A shortcut", v: "Add “…so what?” to your headline." },
];

export function NewsletterSection({ location = "home" as const }: { location?: "home" | "newsletter_page" }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-sheet]"),
          { rotate: 0, x: 0, y: 40 },
          {
            rotate: (i: number) => [-7, 2, 9][i],
            x: (i: number) => [-30, 0, 34][i],
            y: (i: number) => [16, -12, 22][i],
            ease: "power2.out",
            scrollTrigger: { trigger: q("[data-stack]")[0], start: "top 85%", end: "center 45%", scrub: 0.8 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="py-10 md:py-16" aria-labelledby="nl-title">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-[32px] border border-line bg-paper px-6 py-14 sm:px-12 md:py-20 lg:px-16">
          <span className="glow glow-mint -z-10" style={{ width: "900px", left: "-300px", bottom: "-520px" }} />
          <span className="glow glow-lavender -z-10" style={{ width: "800px", right: "-280px", top: "-460px" }} />
          <div className="tex-dots absolute inset-0 -z-10 opacity-80" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="pill pill-plain mb-7">Fortnightly · 5 minutes or less</span>
              <RevealText id="nl-title" text="Your fortnightly dose of ==useful.==" className="t-h2 max-w-[13ch] text-ink" />
              <p className="t-lead mt-5 max-w-md">Lessons, teardowns and shortcuts in five minutes or less.</p>
              <div className="mt-9 max-w-lg">
                <NewsletterForm location={location} />
              </div>
            </div>

            <div data-stack className="relative mx-auto h-[360px] w-full max-w-[420px]" aria-hidden>
              {STACK.map((s, i) => (
                <div
                  key={s.k}
                  data-sheet
                  className="card absolute inset-x-6 top-6 flex h-[290px] flex-col p-6"
                  style={{ zIndex: i === 1 ? 3 : i === 0 ? 2 : 1 }}
                >
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Cloche className="h-5 w-auto" /> Issue #1
                    </span>
                    <span className="text-xs font-medium text-slate">Every two weeks</span>
                  </div>
                  <span className="mt-6 text-sm font-medium text-slate">{s.k}</span>
                  <p className="mt-1.5 text-[1.6rem] font-bold leading-[1.05] tracking-[-0.04em] text-ink">{s.v}</p>
                  <div className="mt-auto grid gap-2">
                    {[1, 0.8].map((w, j) => (
                      <span key={j} className="h-2 rounded-full bg-ink/[0.07]" style={{ width: `${w * 100}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
