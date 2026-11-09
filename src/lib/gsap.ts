"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
  // Brand motion: slow, smooth, never bouncy.
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  // Keep animated elements on the GPU for the whole tween instead of
  // switching layers on and off (which causes a repaint flash per frame).
  gsap.config({ force3D: true });
  // Mobile address-bar show/hide resizes the viewport constantly; don't
  // recalculate every trigger for it (a major source of mobile jank).
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Scrub value for scroll-linked animations. Lenis already smooths the scroll,
 * so a large scrub lag would stack a second delay on top and feel sluggish.
 * A small value keeps motion glued to the scroll with just a hint of easing.
 */
export const SCRUB = 0.25;

/** Media query keys used with gsap.matchMedia() across the site. */
export const MQ = {
  desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
