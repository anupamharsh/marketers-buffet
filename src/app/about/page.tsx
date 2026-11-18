import type { Metadata } from "next";
import Link from "next/link";
import { SKILLS, site } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { Cover } from "@/components/ui/Cover";
import { Icon } from "@/components/ui/Icon";
import { ProfileCard } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "About",
  description: `Behind Marketers Buffet: ${site.owner}, ${site.role} at ${site.company}, ${site.city}.`,
  alternates: { canonical: "/about" },
};

/* Story text from the handoff, used as written. */
const STORY = [
  "I studied Computer Science. On paper, I was supposed to end up writing code for a living.",
  "But somewhere along the way, I got more curious about why people click, buy and stay than about how the system behind it works.",
  "So I started freelancing. And when it was time to pick a full-time path in my fourth year, I chose a contract role as Marketing Specialist at Mimic Productions. I redesigned websites, wrote copy and SEO blogs, and built automations with n8n and Zapier. That's where my engineering side and my marketing side finally met.",
  "Today, I do marketing at Royal Brothers, India's largest bike rental platform. CRM, influencer campaigns, performance ads, newsletters, personal branding: every week brings something new to try.",
  "Along the way, I noticed a problem. I kept learning things at work and forgetting them by the next campaign. So I started writing them down.",
  "Marketers Buffet is that notebook: what I tried, what worked, what didn't, shared so you can skip a few mistakes.",
];

// Journey timeline: the owner will add dates and details later.
const JOURNEY = ["College", "Mimic Productions", "Royal Brothers"];

const LINKS = [
  { label: "Blog", href: "/blog", shape: "dots" as const },
  { label: "Automations", href: "/automations", shape: "lines" as const },
  { label: "The AI edge", href: "/ai-edge", shape: "circles" as const },
  { label: "Templates", href: "/templates", shape: "waves" as const },
];

export default function AboutPage() {
  return (
    <>
      <header className="shell pb-12 pt-32 md:pt-40">
        <Heading as="h1" label="About" lead="Behind" tail="Marketers Buffet." />
      </header>

      <section className="shell" aria-label="Profile">
        <ProfileCard link={false} />
      </section>

      <section className="shell section grid gap-12 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="story">
        <div>
          <h2 id="story" className="t-h1 text-ink">
            My <span className="tail">story</span>
          </h2>
        </div>
        <div className="prose-mb text-ink">
          {STORY.map((p, i) => (
            <p key={i} className={i === STORY.length - 1 ? "font-semibold" : ""}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="panel on-dark grain bg-coal dark:bg-black" aria-labelledby="work">
        <div className="shell section relative z-[1] grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="work" className="t-h1 text-ink">
              What I <span className="tail">work on</span>
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <li key={s} className="pill !h-9 border border-white/20 !px-4 !text-[0.875rem] text-offwhite">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-label !text-lilac">Journey</h2>
            <ol className="mt-6 grid gap-0 border-l border-white/15">
              {JOURNEY.map((j, i) => (
                <li key={j} className="relative pb-8 pl-8 last:pb-0">
                  <span aria-hidden className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full ${i === JOURNEY.length - 1 ? "bg-lilac" : "border border-lilac bg-coal"}`} />
                  <span className="block text-lg font-semibold text-offwhite">{j}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="shell section" aria-labelledby="explore">
        <h2 id="explore" className="t-h1 text-ink">
          Take what <span className="tail">helps.</span>
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="card group !h-auto">
                <Cover cover={{ shape: l.shape, tone: "indigo" }} className="card-cover aspect-[16/9]" />
                <span className="flex items-center justify-between px-3 pb-2 pt-4">
                  <span className="font-semibold text-ink">{l.label}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo text-offwhite transition-colors duration-[160ms] group-hover:bg-indigo-2 dark:bg-lilac dark:text-indigo">
                    <Icon name="arrow-right" size={16} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link href="/book-a-call" className="btn btn-primary">
            Book a call
          </Link>
          <span className="text-muted">First 30 minutes free.</span>
        </div>
      </section>
    </>
  );
}
