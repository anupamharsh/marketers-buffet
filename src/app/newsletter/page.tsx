import type { Metadata } from "next";
import { Heading } from "@/components/ui/Heading";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "What moved in Indian marketing this fortnight: campaigns, launches, platform updates and AI, every two weeks.",
  alternates: { canonical: "/newsletter" },
};

const FACTS = ["Every two weeks", "5-minute read", "Free"];

/* Handoff: no past issues page. */
export default function NewsletterPage() {
  return (
    <div className="pb-24 pt-24 md:pt-28">
      <section className="panel on-dark grain bg-coal dark:bg-black" aria-labelledby="nl-title">
        <div className="relative z-[1] grid lg:grid-cols-2">
          <div className="shell section !max-w-none lg:!pr-6">
            <Heading as="h1" label="Newsletter" id="nl-title" lead="What moved in marketing" tail="this fortnight." />
          </div>
          <div className="m-2 rounded-[22px] bg-[linear-gradient(160deg,#2a1766,#4a2e8a)] p-6 sm:p-10 lg:m-2.5">
            <div className="pat flex h-full flex-col justify-center gap-6" data-shape="lines" style={{ ["--pat-ink" as string]: "rgb(217 200 255 / 0.08)" }}>
              <p className="relative z-[1] max-w-md text-[1.08rem] leading-relaxed text-offwhite">
                By the time a trend hits your feed, it&apos;s already old. Get what&apos;s moving in Indian marketing first: campaigns, launches, platform updates and AI, every two weeks.
              </p>
              <ul className="relative z-[1] flex flex-wrap gap-2">
                {FACTS.map((f) => (
                  <li key={f} className="pill border border-white/20 text-offwhite">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="relative z-[1] max-w-md">
                <NewsletterForm location="newsletter_page" />
                <p className="mt-3 text-[0.8125rem] text-[#c9c3dd]">Unsubscribe in one click, no hard feelings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
