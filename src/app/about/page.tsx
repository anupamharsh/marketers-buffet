import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { AboutStory } from "@/components/about/AboutStory";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { IconArrow } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "About",
  description: "A marketer. That's the short answer.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  { k: "Copy", v: "Headlines, hooks, push notifications, taglines." },
  { k: "Psychology", v: "Why people click, buy, and ignore." },
  { k: "Strategy", v: "Positioning, launches, pricing, growth." },
  { k: "Everyday marketing", v: "Lessons from menus, signboards, packaging and apps." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="Who's _behind this?_" glow="lavender" />
      <AboutStory />

      <section className="py-24 md:py-32" aria-labelledby="pillars-title">
        <div className="shell">
          <RevealText id="pillars-title" text="What gets _written down._" className="t-h2 text-ink" />
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" stagger={0.08}>
            {PILLARS.map((p, i) => (
              <div key={p.k} className="card flex min-h-[230px] flex-col justify-between p-7">
                <span className="t-num text-6xl">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-xl font-bold tracking-[-0.03em] text-ink">{p.k}</p>
                  <p className="mt-1.5 leading-relaxed text-slate">{p.v}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pb-28" aria-label="Closing">
        <div className="shell">
          <div className="border-t border-line pt-16">
            <RevealText as="p" text="Take what you need. _Come back for more._" className="t-h1 max-w-[14ch] text-ink" />
            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
              <Link href="/blog" className="btn btn-primary">
                Start reading <IconArrow size={18} className="btn-arrow" />
              </Link>
              <Link href="/book-a-call" className="btn btn-ghost">
                Book a call
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
