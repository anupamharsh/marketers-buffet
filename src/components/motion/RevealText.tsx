"use client";

import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { rich } from "@/lib/text";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  /** "load" plays immediately (above the fold), "scroll" waits until in view */
  mode?: "load" | "scroll";
  delay?: number;
  serifClass?: string;
  id?: string;
};

/**
 * Headline that reveals line by line from behind a mask, then sweeps the mint
 * highlighter behind any ==highlighted== words. Re-splits on resize/font load.
 */
export function RevealText({ as: Tag = "h2", text, className = "", mode = "scroll", delay = 0, serifClass, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const hls = el.querySelectorAll<HTMLElement>("[data-hl]");
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "mb-line",
          autoSplit: true,
          onSplit(self) {
            // Give italic overhangs and the highlighter room inside the mask.
            const masks = (self as unknown as { masks?: HTMLElement[] }).masks ?? [];
            gsap.set(masks, { paddingBottom: "0.14em", marginBottom: "-0.14em", paddingInline: "0.08em", marginInline: "-0.08em" });
            gsap.set(el, { autoAlpha: 1 });
            gsap.set(hls, { "--hl": 0 });
            const tl = gsap.timeline({
              delay,
              scrollTrigger: mode === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
            });
            tl.from(self.lines, { yPercent: 115, rotate: 1.5, transformOrigin: "0% 100%", duration: 1.15, stagger: 0.085, ease: "expo.out" });
            if (hls.length) tl.to(hls, { "--hl": 1, duration: 0.75, ease: "power2.inOut", stagger: 0.12 }, "-=0.7");
            return tl;
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <Tag ref={ref} id={id} className={className} {...(mode === "load" ? { "data-reveal": "" } : {})}>
      {rich(text, serifClass ? { serifClass } : undefined)}
    </Tag>
  );
}
