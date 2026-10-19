"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { rich } from "@/lib/text";
import { Cloche } from "@/components/brand/Cloche";
import { AppIcon } from "@/components/ui/Props";
import { IconCalendar, IconCheck, IconCross } from "@/components/ui/Icons";

const LINES = [
  "Somewhere, a marketer is juggling _five campaigns,_ two deadlines and one half-finished idea.",
  "In between, they're learning: what works, what flops, and _why._",
  "This site is where those lessons land, _written down_ before they're forgotten.",
  "Take what's useful. ==Leave the rest.==",
];

const CAMPAIGNS = [
  { name: "Diwali sale", status: "Live", result: "win" },
  { name: "App installs", status: "Learning", result: "miss" },
  { name: "Brand film", status: "Draft", result: "why" },
  { name: "Newsletter #12", status: "Scheduled", result: "win" },
  { name: "Retargeting", status: "Paused", result: "miss" },
] as const;

// Five seats on an ellipse around the desk centre (percent of the desk box).
const SEATS = [
  { l: 50, t: 9 },
  { l: 88, t: 34 },
  { l: 76, t: 84 },
  { l: 24, t: 84 },
  { l: 12, t: 34 },
];

const NOTES = ["Why now beats why us.", "Ugly ads stop thumbs.", "Write pushes like texts."];

/**
 * Scroll story 2: "Who's behind this" (Basil Night, the dark insight variant).
 * Desktop: pinned. Campaigns orbit like a juggle, get marked as wins and misses,
 * then everything collapses into one notebook: notes worth keeping.
 */
export function StoryBehind() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const lines = q("[data-line]");
        const camps = q("[data-camp]");
        const orbit = q("[data-orbit]")[0] as HTMLElement;
        const counter = q("[data-count]")[0] as HTMLElement;
        const segs = q("[data-seg]");
        const others = q("[data-other]");

        gsap.set(lines, { autoAlpha: 0, y: 40 });
        gsap.set(lines[0], { autoAlpha: 1, y: 0 });
        gsap.set(q("[data-line] [data-hl]"), { "--hl": 0 });
        gsap.set(camps, { autoAlpha: 0, scale: 0.6 });
        gsap.set(others, { autoAlpha: 0, y: 30 });
        gsap.set(q("[data-badge]"), { scale: 0, autoAlpha: 0 });
        gsap.set(q("[data-notebook]"), { autoAlpha: 0, scale: 0.7, rotate: 6 });
        gsap.set(q("[data-note]"), { clipPath: "inset(0 100% 0 0)" });

        const swap = (from: number, to: number) => {
          const t = gsap.timeline();
          t.to(lines[from], { autoAlpha: 0, y: -40, duration: 0.6, ease: "power2.in" }).to(lines[to], { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">-0.1");
          return t;
        };

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: "+=380%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(3, Math.floor(self.progress * 4.0001));
              counter.textContent = `0${i + 1}`;
              segs.forEach((s, j) => (s.style.backgroundColor = j <= i ? "#F8F7F4" : "#333333"));
            },
          },
        });

        // 1 · juggling
        tl.to(camps, { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.15, ease: "back.out(1.4)" })
          .to(others, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.2 }, "<0.3")
          .to(q("[data-orbit]"), { rotate: 34, duration: 4, ease: "none" }, 0)
          .to(q("[data-counter]"), { rotate: -34, duration: 4, ease: "none" }, 0);

        // 2 · learning: wins and misses
        tl.add(swap(0, 1), 1.6).to(q("[data-badge]"), { scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: "back.out(2)" }, 2);

        // 3 · written down: everything collapses into the notebook
        tl.add(swap(1, 2), 3.6)
          .to(
            camps,
            {
              // Seats are centred on their left/top point, so offsetLeft/Top is the card centre.
              x: (_: number, el: HTMLElement) => orbit.offsetWidth / 2 - el.offsetLeft,
              y: (_: number, el: HTMLElement) => orbit.offsetHeight / 2 - el.offsetTop,
              scale: 0.25,
              autoAlpha: 0,
              duration: 1.1,
              stagger: 0.05,
              ease: "power3.in",
            },
            3.8,
          )
          .to(others, { scale: 0.3, autoAlpha: 0, duration: 0.9, ease: "power3.in" }, 3.9)
          .to(q("[data-notebook]"), { autoAlpha: 1, scale: 1, rotate: -2, duration: 1.1, ease: "expo.out" }, 4.7)
          .to(q("[data-note]"), { clipPath: "inset(0 0% 0 0)", duration: 0.7, stagger: 0.35, ease: "power2.out" }, 5.1);

        // 4 · take what's useful
        tl.add(swap(2, 3), 6.4)
          .to(q("[data-line] [data-hl]"), { "--hl": 1, duration: 0.7 }, 6.9)
          .to(q("[data-notebook]"), { rotate: 1.5, y: -10, duration: 1 }, 6.6)
          .to({}, { duration: 0.8 });
      });

      mm.add(MQ.mobile, () => {
        q("[data-line]").forEach((l) => {
          gsap.from(l, { autoAlpha: 0, y: 40, duration: 0.9, scrollTrigger: { trigger: l, start: "top 85%", once: true } });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-dark relative isolate overflow-hidden bg-charcoal text-cream" aria-labelledby="behind-title">
      <div className="tex-dots-dark pointer-events-none absolute inset-0 -z-10" />
      <span className="glow glow-basil -z-10" style={{ width: "min(1400px,140vw)", left: "-10%", bottom: "-85%", opacity: 0.9 }} />

      <div data-pin className="relative lg:h-[100svh]">
        <div className="shell grid h-full items-center gap-14 py-24 lg:grid-cols-12 lg:gap-8 lg:py-0">
          <div className="relative lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="pill bg-mint text-basil">Who&apos;s behind this</span>
              <span className="hidden text-sm font-medium text-muted-cream lg:inline">
                <span data-count>01</span> / 04
              </span>
            </div>
            <h2 id="behind-title" className="sr-only">
              Who&apos;s behind this
            </h2>
            <div className="relative mt-10 grid gap-10 lg:mt-12 lg:block lg:h-[46vh]">
              {LINES.map((l, i) => (
                <p
                  key={i}
                  data-line
                  className="text-[clamp(1.9rem,3vw,3rem)] font-bold leading-[1.06] tracking-[-0.04em] text-cream lg:absolute lg:inset-x-0 lg:top-0"
                >
                  {rich(l)}
                </p>
              ))}
            </div>
            <div className="mt-8 hidden gap-1.5 lg:flex" aria-hidden>
              {LINES.map((_, i) => (
                <span key={i} data-seg className={`h-[3px] w-10 rounded-full transition-colors duration-500 ${i === 0 ? "bg-cream" : "bg-line-dark"}`} />
              ))}
            </div>
          </div>

          {/* The desk (desktop) */}
          <div data-desk className="relative hidden h-[min(640px,76svh)] lg:col-span-7 lg:block" aria-hidden>
            <div data-orbit className="absolute inset-[6%]">
              {CAMPAIGNS.map((c, i) => (
                <div key={c.name} data-camp className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${SEATS[i].l}%`, top: `${SEATS[i].t}%` }}>
                  <div data-counter>
                    <div className="card-dark relative w-[210px] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.95rem] font-semibold tracking-[-0.015em]">{c.name}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="pill pill-plain h-6 text-xs">{c.status}</span>
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-line-dark">
                          <span className="block h-full rounded-full bg-muted-cream" style={{ width: `${30 + i * 13}%` }} />
                        </span>
                      </div>
                      <span
                        data-badge
                        className={`absolute -right-3 -top-3 grid h-9 min-w-9 place-items-center rounded-full px-2 text-xs font-semibold shadow-lg ${
                          c.result === "win" ? "bg-mint text-basil" : c.result === "miss" ? "bg-[#3a3835] text-muted-cream" : "bg-cream text-ink"
                        }`}
                      >
                        {c.result === "win" ? <IconCheck size={16} /> : c.result === "miss" ? <IconCross size={16} /> : "why?"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Two deadlines */}
            <div data-other className="card-dark absolute left-[30%] top-[38%] flex w-[250px] items-center gap-3 p-3.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#3a3835] text-cream">
                <IconCalendar size={20} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">Deck due</span>
                <span className="block text-sm text-muted-cream">Today, 6:00 pm</span>
              </span>
            </div>
            <div data-other className="card-dark absolute left-[44%] top-[55%] flex w-[250px] items-center gap-3 p-3.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#3a3835] text-cream">
                <IconCalendar size={20} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">Launch</span>
                <span className="block text-sm text-muted-cream">Tomorrow, 9:00 am</span>
              </span>
            </div>
            {/* One half-finished idea */}
            <div data-other className="absolute left-[36%] top-[18%] w-[230px] rotate-[-4deg] rounded-[18px] bg-cream p-4 text-ink shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate">
                <AppIcon letter="N" tint="peach" size={22} /> Notes
              </div>
              <p className="mt-2 text-[0.95rem] font-medium tracking-[-0.01em]">
                what if the ad was just a screenshot of<span className="caret text-basil" />
              </p>
            </div>

            {/* The notebook */}
            <div data-notebook className="tex-ruled absolute left-1/2 top-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-cream p-7 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate">Notes worth keeping</span>
                <Cloche className="h-6 w-auto" />
              </div>
              <ul className="mt-6 grid gap-4">
                {NOTES.map((n) => (
                  <li key={n} data-note className="flex items-center gap-3 text-[1.35rem] font-bold tracking-[-0.03em]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-basil text-cream">
                      <IconCheck size={15} />
                    </span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile: just the notebook */}
          <div className="tex-ruled rounded-[24px] bg-cream p-6 text-ink lg:hidden" aria-hidden>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate">Notes worth keeping</span>
              <Cloche className="h-6 w-auto" />
            </div>
            <ul className="mt-5 grid gap-3.5">
              {NOTES.map((n) => (
                <li key={n} className="flex items-center gap-3 text-lg font-bold tracking-[-0.03em]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-basil text-cream">
                    <IconCheck size={13} />
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
