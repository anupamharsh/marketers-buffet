"use client";

import { useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Animate direct children one after another instead of the wrapper */
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
  id?: string;
};

/** Fade up 20-30px, ease-out. The brand's default motion. */
export function Reveal({ as: Tag = "div", children, className = "", style, stagger, y = 28, delay = 0, start = "top 88%", id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const targets = stagger ? Array.from(el.children) : [el];
        gsap.set(targets, { autoAlpha: 0, y });
        ScrollTrigger.batch(targets, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, delay, ease: "power3.out", stagger: stagger ?? 0, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={style} id={id}>
      {children}
    </Tag>
  );
}
