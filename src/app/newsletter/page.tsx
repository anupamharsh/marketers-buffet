import type { Metadata } from "next";
import { issues } from "@/content/site";
import { formatDate } from "@/lib/text";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Glows } from "@/components/ui/Art";
import { Cloche } from "@/components/brand/Cloche";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "A short fortnightly letter on what's working in marketing, and what isn't.",
  alternates: { canonical: "/newsletter" },
};

const INSIDE = [
  { n: "1", k: "A lesson", v: "One thing I learned at work in the last two weeks, in plain English." },
  { n: "2", k: "A teardown", v: "One ad, email or notification, broken down into the decisions behind it." },
  { n: "3", k: "A shortcut", v: "A prompt, template or test you can use the same afternoon." },
];

export default function NewsletterPage() {
  const sample = issues[0];
  return (
    <>
      <section className="relative isolate overflow-hidden pb-20 pt-36 md:pt-48">
        <div className="mask-fade-b pointer-events-none absolute inset-0 -z-10">
          <Glows glow="both" />
        </div>
        <div className="tex-dots mask-fade-b pointer-events-none absolute inset-0 -z-10" />
        <div className="shell grid items-end gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <span className="pill pill-series mb-8">Every two weeks</span>
            </Reveal>
            <RevealText as="h1" mode="load" text="The notes I'd send _a friend._" className="t-h1 max-w-[12ch] text-ink" />
            <Reveal delay={0.2}>
              <p className="t-lead mt-6 max-w-xl">A short fortnightly letter on what&apos;s working in marketing, and what isn&apos;t.</p>
            </Reveal>
          </div>
          <Reveal delay={0.3} className="card p-6 md:p-8">
            <p className="mb-4 text-lg font-semibold tracking-[-0.02em] text-ink">Five minutes, every other week.</p>
            <NewsletterForm location="newsletter_page" button="Count me in" />
          </Reveal>
        </div>
      </section>

      <section className="pb-24" aria-labelledby="inside-title">
        <div className="shell">
          <h2 id="inside-title" className="t-h2 text-ink">
            What&apos;s <span className="serif serif-basil">inside</span>
          </h2>
          <Reveal className="mt-12 grid gap-5 md:grid-cols-3 lg:gap-6" stagger={0.1}>
            {INSIDE.map((i) => (
              <div key={i.k} className="card flex min-h-[260px] flex-col justify-between p-7">
                <span className="t-num text-7xl">{i.n}</span>
                <div>
                  <p className="text-2xl font-bold tracking-[-0.035em] text-ink">{i.k}</p>
                  <p className="mt-2 leading-relaxed text-slate">{i.v}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Sample issue in a mail window */}
      <section className="pb-24" aria-labelledby="sample-title">
        <div className="shell">
          <h2 id="sample-title" className="t-h2 text-ink">
            A <span className="serif serif-basil">sample</span>
          </h2>
          <Reveal className="mt-12">
            <div className="card mx-auto max-w-4xl overflow-hidden !rounded-[24px]">
              <div className="flex items-center gap-2 border-b border-line bg-paper px-5 py-3.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[#e6e3dc]" />
                <span className="h-3 w-3 rounded-full bg-[#e6e3dc]" />
                <span className="h-3 w-3 rounded-full bg-[#e6e3dc]" />
                <span className="ml-4 text-sm font-medium text-slate">Inbox</span>
              </div>
              <div className="grid gap-1 border-b border-line px-6 py-5 text-sm md:px-10">
                <p>
                  <span className="text-slate">From</span> <span className="font-semibold text-ink">Marketers Buffet</span>
                </p>
                <p>
                  <span className="text-slate">Subject</span>{" "}
                  <span className="font-semibold text-ink">
                    Issue #{sample.number}: {sample.title}
                  </span>
                </p>
              </div>
              <article className="px-6 py-10 md:px-10 md:py-14">
                <Cloche className="h-10 w-auto" />
                <p className="mt-8 text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                  Hi. Here&apos;s what was <span className="serif serif-basil">worth keeping</span> this fortnight.
                </p>
                <div className="mt-10 grid gap-8">
                  {[
                    { k: "The lesson", v: sample.lesson },
                    { k: "The teardown", v: sample.teardown },
                    { k: "The shortcut", v: sample.shortcut },
                  ].map((s) => (
                    <div key={s.k} className="grid gap-2 border-l-2 border-basil pl-5 md:grid-cols-[10rem_1fr] md:gap-8 md:border-l-0 md:pl-0">
                      <p className="font-semibold text-basil">{s.k}</p>
                      <p className="text-lg leading-relaxed text-ink">{s.v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-12 text-slate">Take what you need. See you in two weeks.</p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-28" aria-labelledby="past-title">
        <div className="shell">
          <h2 id="past-title" className="t-h2 text-ink">
            Past <span className="serif serif-basil">issues</span>
          </h2>
          <ul className="mt-10 border-t border-line">
            {issues.map((i) => (
              <li key={i.number} className="flex flex-col gap-2 border-b border-line py-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-baseline gap-5">
                  <span className="t-num text-4xl">#{i.number}</span>
                  <span className="text-xl font-bold tracking-[-0.03em] text-ink">{i.title}</span>
                </span>
                <time dateTime={i.date} className="text-sm font-medium text-slate">
                  {formatDate(i.date)}
                </time>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-slate">The archive grows every two weeks.</p>
        </div>
      </section>
    </>
  );
}
