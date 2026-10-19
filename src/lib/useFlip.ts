"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { Flip, gsap } from "@/lib/gsap";

/**
 * Animate a grid between filter states with GSAP Flip.
 * Call `capture()` right before the state change; children need data-flip-id.
 */
export function useFlip(container: RefObject<HTMLElement | null>, deps: unknown[]) {
  const state = useRef<Flip.FlipState | null>(null);

  const capture = () => {
    if (!container.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    state.current = Flip.getState(container.current.querySelectorAll("[data-flip-id]"));
  };

  useLayoutEffect(() => {
    if (!state.current || !container.current) return;
    Flip.from(state.current, {
      targets: container.current.querySelectorAll("[data-flip-id]"),
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.35 }),
    });
    state.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return capture;
}
