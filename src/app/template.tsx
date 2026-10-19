"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

// The very first page is server-rendered and already visible; only fade on client navigations.
let firstRender = true;

/**
 * Smooth page transition. Opacity only: a transform on this wrapper would
 * break ScrollTrigger pinning inside the page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (firstRender) {
        firstRender = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out", clearProps: "opacity,visibility" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
