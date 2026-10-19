"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { legal, nav, site } from "@/content/site";
import { track } from "@/lib/analytics";
import { Cloche } from "@/components/brand/Cloche";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { RevealText } from "@/components/motion/RevealText";
import { IconArrowUpRight, IconInstagram, IconLinkedIn, IconMail } from "@/components/ui/Icons";
import { OPEN_COOKIES } from "./CookieBanner";

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-footer-word]",
          { yPercent: 60 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          "[data-footer-cloche] .mb-lid",
          { y: 0, rotate: 0 },
          {
            y: -26,
            rotate: -16,
            svgOrigin: "330 268",
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom bottom", scrub: 0.8 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const social = (platform: "instagram" | "linkedin") => () => track({ event: "social_click", platform });

  return (
    <footer ref={ref} className="on-dark relative isolate overflow-hidden bg-charcoal text-cream" aria-labelledby="footer-heading">
      <div className="tex-dots-dark pointer-events-none absolute inset-0" />
      <span className="glow glow-basil" style={{ width: "90vw", left: "-20vw", bottom: "-55vw" }} />

      <div className="shell relative pt-24 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <h2 id="footer-heading" className="sr-only">
              Site footer
            </h2>
            <RevealText as="p" text="Take what you need. _Come back for more._" className="t-h1 max-w-[12ch] text-cream" />
          </div>
          <div className="flex flex-col justify-end">
            <p className="mb-4 text-lg font-semibold tracking-[-0.02em] text-cream">One email, every two weeks.</p>
            <NewsletterForm location="footer" dark button="Count me in" />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-line-dark pt-12 md:grid-cols-4">
          <div>
            <p className="mb-4 text-sm font-medium text-muted-cream">Explore</p>
            <ul className="grid gap-1">
              {[...nav, { href: "/book-a-call", label: "Book a call" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-11 items-center text-[1.02rem] font-medium text-cream">
                    <span className="link-draw">{n.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium text-muted-cream">Elsewhere</p>
            <ul className="grid gap-1">
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" onClick={social("instagram")} className="inline-flex min-h-11 items-center gap-2.5 font-medium">
                  <IconInstagram size={18} /> <span className="link-draw">Instagram</span>
                  <IconArrowUpRight size={14} className="text-muted-cream" />
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" onClick={social("linkedin")} className="inline-flex min-h-11 items-center gap-2.5 font-medium">
                  <IconLinkedIn size={18} /> <span className="link-draw">LinkedIn</span>
                  <IconArrowUpRight size={14} className="text-muted-cream" />
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2.5 break-all font-medium">
                  <IconMail size={18} /> <span className="link-draw">{site.email}</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium text-muted-cream">The fine print</p>
            <ul className="grid gap-1">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center font-medium">
                    <span className="link-draw">{l.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => window.dispatchEvent(new Event(OPEN_COOKIES))}
                  className="inline-flex min-h-11 items-center font-medium"
                >
                  <span className="link-draw">Cookie settings</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="col-span-2 flex items-start md:col-span-1 md:justify-end">
            <div data-footer-cloche className="w-28 md:w-32">
              <Cloche color="#F8F7F4" highlight="#1C1C1C" className="h-auto w-full overflow-visible" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden" aria-hidden>
        <p
          data-footer-word
          className="shell whitespace-nowrap pb-[0.5vw] text-[clamp(3.2rem,13.6vw,14rem)] font-bold leading-[0.8] tracking-[-0.06em] text-cream/[0.08]"
        >
          Marketers <span className="font-serif font-normal italic tracking-[-0.03em]">Buffet</span>
        </p>
      </div>

      <div className="shell relative flex flex-col gap-3 border-t border-line-dark py-6 text-sm text-muted-cream sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 Marketers Buffet ·{" "}
          <Link href="/privacy" className="link-draw">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="link-draw">
            Terms
          </Link>
        </p>
        <p>Made by a marketer, for marketers.</p>
      </div>
    </footer>
  );
}
