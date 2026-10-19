"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Cloche } from "@/components/brand/Cloche";
import { Magnetic } from "@/components/motion/Magnetic";
import { FileBadge, Notification, SearchBar } from "@/components/ui/Props";
import { CursorArrow, IconArrow } from "@/components/ui/Icons";

/**
 * Homepage hero.
 * 1. Dots "type" on the cloche (it doubles as a chat bubble)
 * 2. The lid lifts open and a few marketing artefacts spill out
 * 3. The headline unmasks line by line; the highlighter sweeps under "you need."
 * Plays in full once per session; later visits get a quick version.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: MQ.desktop, mobile: MQ.mobile, reduce: MQ.reduce },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
          const lid = q(".hero-cloche .mb-lid");
          const dots = q(".hero-cloche .mb-dot");
          const props = q("[data-prop]");
          const lines = q("[data-hero-line]");
          const hl = q("[data-hl]");

          if (reduce) {
            gsap.set([q("[data-reveal]"), props], { autoAlpha: 1 });
            props.forEach((p) => gsap.set(p, { rotate: Number(p.dataset.rot || 0) }));
            gsap.set(lid, { y: -70, rotate: -14, svgOrigin: "330 268" });
            return;
          }

          const seen = sessionStorage.getItem("mb-hero") === "1";
          sessionStorage.setItem("mb-hero", "1");

          // Where the props burst from: the gap between lid and plate.
          const stage = q("[data-stage]")[0] as HTMLElement;
          const plate = q(".hero-cloche .mb-plate")[0] as unknown as SVGGElement;
          const sr = stage.getBoundingClientRect();
          const pr = plate.getBoundingClientRect();
          const origin = { x: pr.left + pr.width / 2 - sr.left, y: pr.top - sr.top };

          gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
          gsap.set(hl, { "--hl": 0 });

          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.from(q("[data-cloche-wrap]"), { autoAlpha: 0, scale: 0.86, y: 30, duration: 1.1, transformOrigin: "50% 80%" }, 0);

          if (!seen) {
            // Typing: bounce only (opacity is handled separately so the yoyo can't revive a dot after it fades).
            tl.fromTo(dots, { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2)" }, 0.3)
              .to(dots, { y: -16, duration: 0.3, ease: "sine.inOut", stagger: { each: 0.12, repeat: 3, yoyo: true } }, 0.45)
              .to(dots, { autoAlpha: 0, scale: 0.4, duration: 0.25, ease: "power2.in" }, 1.85);
          } else {
            tl.set(dots, { autoAlpha: 0 }, 0);
          }

          const lift = seen ? 0.35 : 1.95;
          tl.to(lid, { y: desktop ? -78 : -60, rotate: -20, svgOrigin: "330 268", duration: 1.3 }, lift)
            .fromTo(q(".hero-cloche .mb-highlight"), { autoAlpha: 1 }, { autoAlpha: 0.9, duration: 0.3 }, lift);

          // Props spill out of the cloche.
          props.forEach((p, i) => {
            const r = p.getBoundingClientRect();
            const cx = r.left + r.width / 2 - sr.left;
            const cy = r.top + r.height / 2 - sr.top;
            tl.fromTo(
              p,
              { x: origin.x - cx, y: origin.y - cy, scale: 0.2, rotate: gsap.utils.random(-25, 25), autoAlpha: 0 },
              { x: 0, y: 0, scale: 1, rotate: Number(p.dataset.rot || 0), autoAlpha: 1, duration: 1.5 },
              lift + 0.08 + i * 0.07,
            );
          });

          // Headline.
          const head = seen ? 0.15 : 1.35;
          tl.from(lines, { yPercent: 112, rotate: 2, transformOrigin: "0% 100%", duration: 1.25, stagger: 0.09 }, head)
            .to(hl, { "--hl": 1, duration: 0.8, ease: "power2.inOut" }, head + 0.75)
            .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 22, duration: 1, stagger: 0.08, ease: "power3.out" }, head + 0.55);

          // Idle float, once everything has landed.
          tl.add(() => {
            props.forEach((p, i) => {
              gsap.to(p.querySelector("[data-float]"), {
                y: i % 2 ? 9 : -9,
                duration: 2.6 + i * 0.35,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            });
            gsap.to(q("[data-lid-float]"), { y: -8, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
          });

          // Scroll: props drift away at different depths, lid settles back down.
          props.forEach((p) => {
            gsap.to(p.querySelector("[data-drift]"), {
              y: -Number(p.dataset.depth || 1) * (desktop ? 140 : 70),
              ease: "none",
              scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
            });
          });
          gsap.to(q("[data-cloche-scroll]"), {
            y: desktop ? 80 : 30,
            scale: 0.94,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
          });

          // Pointer parallax.
          if (desktop) {
            const movers = props.map((p) => ({
              x: gsap.quickTo(p.querySelector("[data-par]"), "x", { duration: 1, ease: "power3.out" }),
              y: gsap.quickTo(p.querySelector("[data-par]"), "y", { duration: 1, ease: "power3.out" }),
              d: Number(p.dataset.depth || 1),
            }));
            const onMove = (e: PointerEvent) => {
              const nx = e.clientX / window.innerWidth - 0.5;
              const ny = e.clientY / window.innerHeight - 0.5;
              movers.forEach((m) => {
                m.x(nx * 26 * m.d);
                m.y(ny * 20 * m.d);
              });
            };
            window.addEventListener("pointermove", onMove);
            return () => window.removeEventListener("pointermove", onMove);
          }
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Buffet Light: both glows, soft, never meeting in the middle, never behind the headline */}
      <div className="tex-dots mask-fade-b pointer-events-none absolute inset-0 -z-10" />
      <span className="glow glow-mint -z-10" style={{ width: "min(1100px,120vw)", left: "-38%", bottom: "-55%" }} />
      <span className="glow glow-lavender -z-10" style={{ width: "min(1000px,110vw)", right: "-30%", top: "-45%" }} />

      <div className="shell grid min-h-[100svh] items-center gap-10 pb-16 pt-28 md:pt-32 lg:grid-cols-12 lg:gap-6 lg:pb-20">
        <div className="relative z-10 lg:col-span-7">
          <p data-hero-fade className="mb-7 flex items-center gap-3">
            <span className="pill pill-plain">
              <span className="h-1.5 w-1.5 rounded-full bg-basil" aria-hidden />
              Notes from a working marketer
            </span>
          </p>
          <h1 id="hero-title" data-reveal className="t-display text-ink">
            <span className="sr-only">A lot of marketing. Take what you need.</span>
            <span aria-hidden className="block">
              {["A lot of", "marketing.", "Take what"].map((l) => (
                <span key={l} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                  <span data-hero-line className="block">
                    {l}
                  </span>
                </span>
              ))}
              <span className="block overflow-hidden px-[0.06em] -mx-[0.06em] pb-[0.14em] -mb-[0.14em]">
                <span data-hero-line className="block">
                  <span className="serif serif-basil hl" data-hl>
                    you need.
                  </span>
                </span>
              </span>
            </span>
          </h1>
          <p data-hero-fade className="t-lead mt-8 max-w-[34rem]">
            Marketing blogs, ad teardowns, quick tips, AI workflows and templates from a working marketer who writes down
            what&apos;s worth keeping.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/blog" className="btn btn-primary">
                Read the latest <IconArrow size={18} className="btn-arrow" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/newsletter" className="btn btn-ghost">
                Get the newsletter
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Stage */}
        <div data-stage className="relative mx-auto aspect-[1/0.95] w-full max-w-[560px] lg:col-span-5 lg:max-w-none" aria-hidden>
          <div data-cloche-scroll className="absolute inset-x-[16%] bottom-[4%] top-[34%]">
            <div data-cloche-wrap className="h-full w-full">
              <div data-lid-float className="h-full w-full">
                <Cloche dots className="hero-cloche h-full w-full overflow-visible" />
              </div>
            </div>
          </div>

          <HeroProp className="left-[-4%] top-[6%] w-[74%] lg:left-[-14%]" rot={-3} depth={1.4}>
            <Notification app="RideApp" letter="R" title="Driver arriving in 2 min" body="It's raining. We'll wait a little longer." />
          </HeroProp>

          <HeroProp className="right-[-2%] top-[25%] w-[58%] lg:right-[-8%]" rot={2.5} depth={0.8}>
            <SearchBar query="why now ad examples" />
          </HeroProp>

          <HeroProp className="left-[-2%] top-[52%] hidden sm:block lg:left-[-10%]" rot={-5} depth={1.1}>
            <div className="card flex items-center gap-3 px-4 py-3">
              <FileBadge type="PDF" />
              <span className="text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">Hooks you can use</span>
              <span className="pill pill-tag h-6 text-xs">Free</span>
            </div>
          </HeroProp>

          <HeroProp className="right-[2%] top-[2%] hidden sm:block" rot={4} depth={0.6}>
            <span className="pill pill-ink h-10 px-4 text-sm">Clear all</span>
          </HeroProp>

          <HeroProp className="right-[18%] top-[47%] hidden lg:block" rot={0} depth={1.8}>
            <CursorArrow className="drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]" />
          </HeroProp>
        </div>
      </div>

      {/* Scroll cue */}
      <div data-hero-fade className="pointer-events-none absolute bottom-6 right-[clamp(1.25rem,5vw,5rem)] hidden items-center gap-3 text-sm font-medium text-slate md:flex">
        Scroll
        <span className="relative h-10 w-[1.5px] overflow-hidden bg-ink/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_ease-in-out_infinite] bg-ink" />
        </span>
        <style>{`@keyframes cue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
      </div>
    </section>
  );
}

function HeroProp({
  children,
  className = "",
  rot = 0,
  depth = 1,
}: {
  children: React.ReactNode;
  className?: string;
  rot?: number;
  depth?: number;
}) {
  return (
    // Each layer owns one kind of motion so tweens never fight over the same transform:
    // prop = intro burst, drift = scroll, par = pointer parallax, float = idle bob.
    <div data-prop data-reveal data-rot={rot} data-depth={depth} className={`absolute ${className}`}>
      <div data-drift>
        <div data-par>
          <div data-float>{children}</div>
        </div>
      </div>
    </div>
  );
}
