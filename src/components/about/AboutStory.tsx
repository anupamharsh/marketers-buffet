"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { rich } from "@/lib/text";
import { Cloche } from "@/components/brand/Cloche";

const PARAS = [
  "A marketer. That's the _short answer._",
  "The longer one: someone juggling campaigns, deadlines and a never-ending list of things to learn. Somewhere between the work and the learning, a few things felt _worth writing down._",
  "So this is that. Not a course. Not a guru. Just notes from the middle of it: what worked, what didn't, and what I'd do _differently._",
  "No name, no face. The work speaks ==louder anyway.==",
];

/**
 * About: scroll-revealed persona copy. Words light up from faint to ink as they
 * pass the reading line, so the text reads at the reader's pace.
 * The final state is always full-contrast ink.
 */
export function AboutStory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const splits = q("[data-para]").map((p) => {
          const hls = p.querySelectorAll("[data-hl]");
          gsap.set(hls, { "--hl": 0 });
          const s = SplitText.create(p, { type: "words", wordsClass: "mb-word" });
          gsap.fromTo(
            s.words,
            { opacity: 0.14 },
            { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 50%", scrub: true } },
          );
          if (hls.length) gsap.to(hls, { "--hl": 1, duration: 0.8, scrollTrigger: { trigger: p, start: "bottom 60%", once: true } });
          return s;
        });

        // The faceless portrait: the cloche "types", then lifts slightly as you read.
        gsap.to(q(".about-cloche .mb-dot"), { autoAlpha: 1, duration: 0.2 });
        gsap.to(q(".about-cloche .mb-dot"), { y: -14, duration: 0.45, ease: "sine.inOut", stagger: { each: 0.15, repeat: -1, yoyo: true } });
        gsap.to(q(".about-cloche .mb-lid"), {
          y: -40,
          rotate: -12,
          svgOrigin: "330 268",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        });
        return () => splits.forEach((s) => s.revert());
      });
      mm.add(MQ.reduce, () => {
        gsap.set(q(".about-cloche .mb-dot"), { autoAlpha: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="shell grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
      <div className="relative hidden lg:block" aria-hidden>
        <div className="sticky top-[22vh]">
          <div className="relative isolate aspect-square w-full max-w-[420px]">
            <span className="glow glow-mint -z-10" style={{ width: "140%", left: "-30%", top: "-20%" }} />
            <Cloche dots className="about-cloche h-full w-full overflow-visible" />
          </div>
          <p className="mt-8 text-sm font-medium text-slate">Portrait of the author, approximately.</p>
        </div>
      </div>
      <div className="grid gap-[18vh] pb-[12vh] pt-[6vh]">
        {PARAS.map((p, i) => (
          <p key={i} data-para className={`font-bold tracking-[-0.04em] text-ink ${i === 0 || i === 3 ? "text-[clamp(2.4rem,5.2vw,4.75rem)] leading-[1]" : "text-[clamp(1.75rem,3.2vw,2.9rem)] leading-[1.1]"}`}>
            {rich(p)}
          </p>
        ))}
      </div>
    </div>
  );
}
