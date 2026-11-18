"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The only scroll motion on the site: elements with class "fade" fade in
 * (240ms) when they enter the screen. No movement, no parallax.
 */
export function Fades() {
  const path = usePathname();
  useEffect(() => {
    (window as unknown as { __mbReady?: boolean }).__mbReady = true;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".fade:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);
  return null;
}
