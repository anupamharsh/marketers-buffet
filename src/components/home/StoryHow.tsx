"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { rich } from "@/lib/text";
import { Glows } from "@/components/ui/Art";
import { CalendarSlot, FileBadge, Notification, PhoneFrame } from "@/components/ui/Props";
import { CursorArrow, IconArrow, IconCheck } from "@/components/ui/Icons";
import type { Glow } from "@/content/types";

type Panel = { n: string; head: string; line: string; href: string; cta: string; glow: Glow; prop: ReactNode };

const PANELS: Panel[] = [
  { n: "01", head: "Got _2 minutes?_", line: "Grab a quick tip.", href: "/blog?format=quick-tip", cta: "Quick tips", glow: "mint", prop: <TimerProp /> },
  { n: "02", head: "Got _20?_", line: "Read a teardown of an ad that worked, or didn't.", href: "/blog?format=teardown", cta: "Teardowns", glow: "lavender", prop: <PhoneProp /> },
  { n: "03", head: "Need to ship _today?_", line: "Use a template.", href: "/templates", cta: "Templates", glow: "both", prop: <DownloadProp /> },
  { n: "04", head: "Want to _talk it through?_", line: "Book a call. The first 30 minutes are free.", href: "/book-a-call", cta: "Book a call", glow: "mint", prop: <CallProp /> },
];

/**
 * Scroll story 3: "How to use this site". A horizontal scroll on desktop;
 * each panel's prop plays as it slides into view.
 */
export function StoryHow() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;

        const h = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true } });

        const panelTl = (sel: string) => {
          const panel = q(sel)[0];
          return gsap.timeline({ scrollTrigger: { trigger: panel, containerAnimation: h, start: "left 75%", end: "center 55%", scrub: 0.6 } });
        };

        // 01 timer ring
        gsap.set(q("[data-ring]"), { strokeDashoffset: 1 });
        panelTl("[data-panel='0']").to(q("[data-ring]"), { strokeDashoffset: 0, ease: "none" });

        // 02 teardown annotation
        gsap.set(q("[data-panel='1'] [data-scribble]"), { strokeDashoffset: 1 });
        gsap.set(q("[data-note-card]"), { autoAlpha: 0, x: 30 });
        panelTl("[data-panel='1']")
          .from(q("[data-phone]"), { y: 80, rotate: 6, ease: "power2.out" })
          .to(q("[data-panel='1'] [data-scribble]"), { strokeDashoffset: 0, ease: "power1.inOut" })
          .to(q("[data-note-card]"), { autoAlpha: 1, x: 0 });

        // 03 download
        gsap.set(q("[data-bar]"), { scaleX: 0 });
        gsap.set(q("[data-done]"), { autoAlpha: 0, scale: 0.6 });
        panelTl("[data-panel='2']").to(q("[data-bar]"), { scaleX: 1, ease: "none" }).to(q("[data-done]"), { autoAlpha: 1, scale: 1, ease: "back.out(2)" });

        // 04 booking
        gsap.set(q("[data-cursor]"), { x: 120, y: 140 });
        gsap.set(q("[data-booked]"), { autoAlpha: 0, y: 20 });
        panelTl("[data-panel='3']")
          .to(q("[data-cursor]"), { x: 0, y: 0, ease: "power2.inOut" })
          .to(q("[data-cursor]"), { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 })
          .to(q("[data-booked]"), { autoAlpha: 1, y: 0 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-paper" aria-labelledby="how-title">
      <div className="tex-dots pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div data-pin className="relative lg:h-[100svh] lg:overflow-hidden">
        <div
          data-track
          className="flex flex-col gap-5 px-[clamp(1.25rem,5vw,5rem)] py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-7 lg:py-0 lg:pr-[12vw]"
        >
          <div className="lg:w-[34vw] lg:min-w-[420px] lg:pr-10">
            <span className="pill pill-series">How to use this site</span>
            <h2 id="how-title" className="t-h1 mt-7 text-ink">
              Four ways <span className="serif serif-basil">in.</span>
            </h2>
            <p className="t-lead mt-6 max-w-[26rem]">Pick by how much time you&apos;ve got. Everything here is built to be used, not just read.</p>
            <p className="mt-10 hidden items-center gap-3 text-sm font-medium text-slate lg:flex">
              Keep scrolling <IconArrow size={16} />
            </p>
          </div>

          {PANELS.map((p, i) => (
            <article
              key={p.n}
              data-panel={i}
              className="card relative grid shrink-0 overflow-hidden !rounded-[28px] md:grid-cols-[1fr_1.05fr] lg:h-[min(72svh,620px)] lg:w-[min(66vw,940px)]"
            >
              <div className="flex flex-col justify-between gap-10 p-7 sm:p-10">
                <span className="t-num text-[5.5rem] lg:text-[7rem]">{p.n}</span>
                <div>
                  <h3 className="text-[clamp(2rem,3.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.045em] text-ink">{rich(p.head)}</h3>
                  <p className="t-lead mt-4 max-w-[22rem]">{p.line}</p>
                  <Link href={p.href} className="btn btn-ghost btn-sm mt-8">
                    {p.cta} <IconArrow size={16} className="btn-arrow" />
                  </Link>
                </div>
              </div>
              <div className="relative isolate min-h-[340px] overflow-hidden border-t border-line bg-paper md:border-l md:border-t-0">
                <Glows glow={p.glow} />
                <div className="tex-dots absolute inset-0 opacity-80" />
                <div className="relative grid h-full place-items-center p-8" aria-hidden>
                  {p.prop}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="absolute inset-x-[clamp(1.25rem,5vw,5rem)] bottom-8 hidden h-[2px] overflow-hidden rounded-full bg-ink/10 lg:block" aria-hidden>
          <span data-progress className="block h-full origin-left bg-basil" />
        </div>
      </div>
    </section>
  );
}

function TimerProp() {
  return (
    <div className="relative grid h-[220px] w-[220px] place-items-center">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="100" cy="100" r="88" fill="#fff" stroke="#ECEAE5" strokeWidth="6" />
        <circle data-ring cx="100" cy="100" r="88" fill="none" stroke="#1E4D3E" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      </svg>
      <div className="relative text-center">
        <span className="t-num block text-7xl">2:00</span>
        <span className="mt-1 block text-sm font-medium text-slate">quick tip</span>
      </div>
    </div>
  );
}

function PhoneProp() {
  return (
    <div className="relative">
      <div data-phone>
        <PhoneFrame className="w-[200px]">
          <div className="flex h-full flex-col px-3.5 pb-4 pt-9">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-peach" />
              <span className="text-[0.65rem] font-semibold leading-tight text-ink">
                Bike rental
                <span className="block font-medium text-slate">Sponsored</span>
              </span>
            </div>
            <div className="mt-3 flex-1 rounded-xl bg-mint" />
            <p className="mt-3 text-[0.95rem] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
              <span className="relative inline-block">
                Long weekend in 3 days.
                <svg className="pointer-events-none absolute -inset-x-2 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+16px)]" viewBox="0 0 200 80" preserveAspectRatio="none" overflow="visible">
                  <path data-scribble d="M118 9C70 5 18 15 9 38c-8 22 40 36 96 36 54 0 90-14 88-36C190 14 134 2 70 10" fill="none" stroke="#1E4D3E" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset="0" strokeLinecap="round" />
                </svg>
              </span>
            </p>
            <span className="mt-3 rounded-lg bg-ink py-2 text-center text-[0.7rem] font-semibold text-cream">Book now</span>
          </div>
        </PhoneFrame>
      </div>
      <div data-note-card className="card absolute -right-28 top-24 w-[170px] p-3 text-sm">
        <span className="t-num text-2xl">1</span>
        <p className="mt-1 font-semibold leading-tight tracking-[-0.01em] text-ink">It borrows a deadline.</p>
      </div>
      <p className="mt-3 text-center text-xs font-medium text-slate">Illustrative ad</p>
    </div>
  );
}

function DownloadProp() {
  return (
    <div className="card w-full max-w-[340px] p-5">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold tracking-[-0.03em] text-ink">Hooks you can use</span>
        <span className="pill pill-tag h-6 text-xs">Free</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        <FileBadge type="PDF" />
        <FileBadge type="Notion" />
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-line">
        <span data-bar className="block h-full origin-left rounded-full bg-basil" />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm font-medium text-slate">
        <span>hooks-you-can-use.pdf</span>
        <span data-done className="flex items-center gap-1.5 font-semibold text-basil">
          <IconCheck size={16} /> Done
        </span>
      </div>
    </div>
  );
}

function CallProp() {
  return (
    <div className="relative w-full max-w-[340px]">
      <CalendarSlot />
      <span data-cursor className="absolute left-[22%] top-[74%] block">
        <CursorArrow />
      </span>
      <div data-booked className="absolute -bottom-28 left-6 right-[-1.5rem]">
        <Notification app="Calendar" letter="B" tint="mint" title="Booked!" body="See you Wednesday at 3:30." time="now" />
      </div>
    </div>
  );
}
