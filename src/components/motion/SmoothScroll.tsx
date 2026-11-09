"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Lenis smooth scrolling synced to GSAP's ticker. Off for reduced motion and touch. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Tell the inline safety net in <head> that JS is alive, so hidden-until-animated content stays managed by GSAP.
    (window as unknown as { __mbReady?: boolean }).__mbReady = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // lerp 0.1: responsive but silky. Touch keeps native scrolling (smoothest on phones).
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false, anchors: { offset: -96 } });
    l.on("scroll", ScrollTrigger.update);
    // Lenis and every GSAP tween share one rAF loop, so scroll position and animation never drift apart.
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    // Web fonts swapping in shift the layout; re-measure pins once they're ready so nothing jumps.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      setLenis(null);
    };
  }, []);

  // Reset scroll on route change and re-measure triggers once the new page has laid out.
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
