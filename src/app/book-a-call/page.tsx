import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { IconArrow, IconCheck } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Book a call",
  description: "A campaign that's stuck, an idea that needs shape, or a gig you want help with. First 30 minutes free.",
  alternates: { canonical: "/book-a-call" },
};

const EXPECT = ["A real conversation about your problem", "Honest feedback, even when it's not what you hoped", "One or two things you can try the same week"];

export default function BookACallPage() {
  return (
    <>
      <PageHero
        label="1:1 calls"
        title="Let's figure it out _together._"
        line="A campaign that's stuck, an idea that needs shape, or a gig you want help with."
        glow="mint"
      />

      <section className="pb-28" aria-label="Pricing and booking">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
          <div className="grid content-start gap-5">
            <Reveal className="card p-7">
              <p className="text-sm font-semibold text-slate">How it works</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex-1 rounded-2xl bg-mint/70 p-5">
                  <span className="t-num block text-5xl">30</span>
                  <span className="mt-1 block font-semibold text-ink">minutes free</span>
                </div>
                <IconArrow size={22} className="shrink-0 text-basil" />
                <div className="flex-1 rounded-2xl bg-paper p-5 ring-1 ring-line">
                  <span className="t-num block text-5xl">₹99</span>
                  <span className="mt-1 block font-semibold text-ink">per hour after</span>
                </div>
              </div>
            </Reveal>
            <Reveal className="card p-7" delay={0.1}>
              <p className="text-2xl font-bold tracking-[-0.035em] text-ink">
                What to <span className="serif serif-basil">expect</span>
              </p>
              <p className="mt-2 text-slate">No pitch, no pressure. Just a real conversation about your problem.</p>
              <ul className="mt-6 grid gap-3">
                {EXPECT.map((e) => (
                  <li key={e} className="flex gap-3 text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-basil text-cream">
                      <IconCheck size={13} />
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="px-1 text-sm leading-relaxed text-slate">
                Paid sessions can be rescheduled free up to 24 hours before the call.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <BookingWidget />
          </Reveal>
        </div>
      </section>
    </>
  );
}
