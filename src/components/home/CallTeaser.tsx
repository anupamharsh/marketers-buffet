"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { CalendarSlot } from "@/components/ui/Props";
import { CursorArrow, IconArrow } from "@/components/ui/Icons";

export function CallTeaser() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-cal]")[0], start: "top 75%", once: true } });
        tl.from(q("[data-cal]"), { y: 50, rotate: 3, autoAlpha: 0, duration: 1 })
          .fromTo(q("[data-cursor]"), { x: 140, y: 120, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1.1, ease: "power2.inOut" }, "-=0.4")
          .to(q("[data-cursor]"), { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 })
          .fromTo(q("[data-pop]"), { autoAlpha: 0, y: 12, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(2)" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="py-24 md:py-32" aria-labelledby="call-title">
      <div className="shell grid items-center gap-14 lg:grid-cols-2">
        <div>
          <RevealText id="call-title" text="Need a second pair of _eyes?_" className="t-h1 max-w-[11ch] text-ink" />
          <p className="t-lead mt-6 max-w-md">Ideas, feedback, or a gig. The first 30 minutes are free, no strings attached.</p>
          <div className="mt-9">
            <Magnetic>
              <Link href="/book-a-call" className="btn btn-primary" onClick={() => track({ event: "call_booking_start", page: "home" })}>
                Book a call <IconArrow size={18} className="btn-arrow" />
              </Link>
            </Magnetic>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[420px]" aria-hidden>
          <span className="glow glow-mint" style={{ width: "640px", left: "-160px", top: "-180px" }} />
          <div data-cal className="relative">
            <CalendarSlot className="max-w-none" />
            <span data-cursor className="absolute left-[22%] top-[74%]">
              <CursorArrow />
            </span>
            <span data-pop className="pill pill-series absolute -right-3 -top-4 h-9 px-4 text-sm shadow-lg">
              First 30 min free
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
