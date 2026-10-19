"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Scribble } from "@/components/motion/Scribble";
import { FileBadge } from "@/components/ui/Props";
import { IconClock, IconDownload } from "@/components/ui/Icons";

/**
 * Scroll story 1: "What you'll find".
 * Desktop: pinned. Two lazy kinds of advice get struck through, "neither" gets
 * circled, then three cards are dealt out like a hand.
 */
export function StoryFind() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const strikes = q("[data-a] [data-scribble]");
        const circle = q("[data-b] [data-scribble]");
        const cards = q("[data-card]");
        gsap.set(q("[data-b]"), { autoAlpha: 0, y: 90 });
        gsap.set(q("[data-c-line]"), { autoAlpha: 0, y: 40 });
        gsap.set(q("[data-c-line] [data-hl]"), { "--hl": 0 });
        gsap.set(cards, { yPercent: 140, rotate: (i: number) => [-14, 4, 16][i], autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: "+=320%", scrub: 0.8, pin: true, anticipatePin: 1 },
        });
        tl.to(strikes[0], { strokeDashoffset: 0, duration: 1 })
          .to(strikes[1], { strokeDashoffset: 0, duration: 1 }, "+=0.15")
          .to(q("[data-a]"), { y: -110, autoAlpha: 0, duration: 1.2 }, "+=0.5")
          .to(q("[data-b]"), { y: 0, autoAlpha: 1, duration: 1.2 }, "<0.25")
          .to(circle, { strokeDashoffset: 0, duration: 1.1 }, "+=0.1")
          .to(q("[data-b]"), { y: "-25vh", scale: 0.56, transformOrigin: "0% 50%", duration: 1.4 }, "+=0.6")
          .to(q("[data-b] .t-lead"), { autoAlpha: 0, duration: 0.6 }, "<")
          .to(cards, { yPercent: 0, rotate: (i: number) => [-3, 0, 3][i], autoAlpha: 1, duration: 1.6, stagger: 0.28, ease: "expo.out" }, "<0.2")
          .to(q("[data-c-line]"), { autoAlpha: 1, y: 0, duration: 1 }, "-=0.4")
          .to(q("[data-c-line] [data-hl]"), { "--hl": 1, duration: 0.8 }, "-=0.3")
          .to({}, { duration: 0.8 });
      });

      mm.add(MQ.mobile, () => {
        q("[data-scribble]").forEach((p) => {
          gsap.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut", scrollTrigger: { trigger: p, start: "top 80%", once: true } });
        });
        gsap.from(q("[data-card]"), { y: 50, autoAlpha: 0, stagger: 0.12, duration: 0.9, scrollTrigger: { trigger: q("[data-cards]")[0], start: "top 85%", once: true } });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden border-y border-line bg-paper" aria-labelledby="find-title">
      <div className="tex-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <span className="glow glow-mint -z-10" style={{ width: "min(1000px,120vw)", left: "-30%", bottom: "-60%" }} />

      <div data-pin className="relative lg:h-[100svh]">
        <div className="shell relative flex h-full flex-col gap-20 py-24 lg:block lg:py-0">
          <p className="relative z-10 flex items-center gap-2.5 text-sm font-medium text-slate lg:absolute lg:left-[clamp(1.25rem,5vw,5rem)] lg:top-28">
            <span className="pill pill-series">What you&apos;ll find</span>
            <span className="hidden lg:inline">01 / 03</span>
          </p>

          {/* Scene A */}
          <div data-a className="lg:absolute lg:inset-x-[clamp(1.25rem,5vw,5rem)] lg:top-1/2 lg:-translate-y-1/2">
            <h2 id="find-title" className="t-h1 max-w-[16ch] text-ink">
              Most marketing advice is either{" "}
              <Scribble kind="strike" tone="basil" manual>
                too basic
              </Scribble>{" "}
              or{" "}
              <Scribble kind="strike" tone="basil" manual>
                too polished.
              </Scribble>
            </h2>
          </div>

          {/* Scene B */}
          <div data-b className="lg:absolute lg:inset-x-[clamp(1.25rem,5vw,5rem)] lg:top-1/2 lg:-translate-y-1/2">
            <p className="t-display text-ink">
              This is{" "}
              <Scribble kind="circle" tone="basil" manual className="ml-[0.12em]">
                <span className="serif serif-basil">neither.</span>
              </Scribble>
            </p>
            <p className="t-lead mt-6 max-w-[34rem]">It&apos;s what actually happens at work: the ideas, the tests, the misses.</p>
          </div>

          {/* Scene C */}
          <div className="lg:absolute lg:inset-x-[clamp(1.25rem,5vw,5rem)] lg:top-[40%]">
            <div data-cards className="grid gap-4 md:grid-cols-3 lg:gap-6">
              <FindCard title="Long reads" serif="when you want depth." pill="Essay · Teardown">
                <div className="grid gap-2">
                  {[1, 0.92, 0.97, 0.6].map((w, i) => (
                    <span key={i} className="h-2 rounded-full bg-ink/[0.08]" style={{ width: `${w * 100}%` }} />
                  ))}
                  <span className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate">
                    <IconClock size={15} /> 12 min read
                  </span>
                </div>
              </FindCard>
              <FindCard title="Quick tips" serif="when you don't." pill="Quick tip">
                <div className="flex items-end gap-3">
                  <span className="t-num text-6xl">2</span>
                  <span className="mb-1.5 text-sm font-medium text-slate">minutes, tops</span>
                </div>
              </FindCard>
              <FindCard title="Templates" serif="when you need to ship." pill="Free + paid">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex gap-1.5">
                    <FileBadge type="PDF" />
                    <FileBadge type="Notion" />
                  </span>
                  <span className="btn btn-primary btn-sm pointer-events-none !min-h-9 !px-3.5 text-sm">
                    <IconDownload size={15} /> Download
                  </span>
                </div>
              </FindCard>
            </div>
            <p data-c-line className="mt-10 text-[clamp(1.6rem,2.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
              No guru. No course funnel. Just notes{" "}
              <span className="serif serif-basil hl" data-hl>
                worth keeping.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FindCard({ title, serif, pill, children }: { title: string; serif: string; pill: string; children: React.ReactNode }) {
  return (
    <div data-card className="card flex min-h-[250px] flex-col justify-between gap-8 p-6 lg:min-h-[270px] lg:p-7">
      <div>
        <span className="pill pill-plain mb-5">{pill}</span>
        <p className="text-[1.75rem] font-bold leading-[1.02] tracking-[-0.04em] text-ink">
          {title} <span className="serif serif-basil block">{serif}</span>
        </p>
      </div>
      {children}
    </div>
  );
}
