import Link from "next/link";
import { sortedPosts } from "@/content/blog";
import { sortedAutomations } from "@/content/automations";
import { sortedAiEdge } from "@/content/ai-edge";
import { templates } from "@/content/templates";
import { heroPhotos } from "@/content/home";
import { site } from "@/content/site";
import { TOOLS, type ToolId } from "@/content/tools";
import { Cover } from "@/components/ui/Cover";
import { Heading } from "@/components/ui/Heading";
import { Icon, type TablerName } from "@/components/ui/Icon";
import { CopyButton } from "@/components/ui/CopyButton";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { AiEdgeCard, AutomationCard, PostCard, TemplateCard } from "@/components/cards";
import { Cloche } from "@/components/brand/Cloche";

function ViewAll({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <div className="mt-8 flex justify-end">
      <Link href={href} className="link inline-flex min-h-10 items-center gap-1.5 font-semibold text-ink">
        {label} <Icon name="arrow-right" size={16} />
      </Link>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
export function Hero() {
  const pills: { label: string; href: string; icon: TablerName }[] = [
    { label: "Blogs", href: "/blog", icon: "pencil" },
    { label: "Automations", href: "/automations", icon: "bolt" },
    { label: "Case studies", href: "/blog?tag=Case+study", icon: "file-text" },
    { label: "Templates", href: "/templates", icon: "template" },
  ];
  return (
    <section className="on-dark grain relative overflow-hidden bg-[linear-gradient(180deg,#1a0b4b_0%,#22105e_60%,#2e1a6e_100%)]" aria-labelledby="hero-title">
      <div className="shell relative z-[1] pb-16 pt-36 text-center md:pt-44">
        <h1 id="hero-title" className="t-hero mx-auto max-w-[11ch] text-offwhite">
          The work behind{" "}
          <span className="text-lilac">
            the work<span className="text-violet">.</span>
          </span>
        </h1>
        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {pills.map((p) => (
            <li key={p.label}>
              <Link href={p.href} className="chip !border-white/20 !min-h-10 bg-white/5 text-offwhite hover:!border-white/50">
                <Icon name={p.icon} size={15} />
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.95rem] text-[#c9c3dd]">from a working marketer in India.</p>

        {/* Photo row: owner photos go in src/content/home.ts */}
        <div className="mx-auto mt-16 grid max-w-[1000px] grid-cols-3 items-end gap-3 sm:grid-cols-5" aria-hidden={!heroPhotos.some((p) => p.image)}>
          {heroPhotos.map((c, i) => (
            <Cover
              key={i}
              cover={c}
              priority={i === 2}
              sizes="20vw"
              className={`rounded-[22px] ${i === 2 ? "aspect-[4/5] sm:aspect-[1/1.2]" : "aspect-[4/5]"} ${i === 0 || i === 4 ? "hidden sm:block" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 01 About ─────────────────────────────────────────────────── */
export function About() {
  const links = [
    { label: "Blog", href: "/blog", shape: "dots" as const },
    { label: "Automations", href: "/automations", shape: "lines" as const },
    { label: "The AI edge", href: "/ai-edge", shape: "circles" as const },
    { label: "Templates", href: "/templates", shape: "waves" as const },
  ];
  return (
    <section className="section fade" aria-labelledby="about-title">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <Heading num="01" label="About" id="about-title" lead="Made by a marketer," tail="for marketers." />
          <p className="max-w-md text-[1.1rem] leading-relaxed text-ink">
            Marketers Buffet is a working notebook. Everything here comes from two places: real campaigns, and the learning that never stops around them. What got tested, what flopped, what moved the number, and what&apos;s worth trying next. Take what helps. Skip what doesn&apos;t.
          </p>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {links.map((l) => (
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
      </div>
    </section>
  );
}

/* ── 02 Latest read ───────────────────────────────────────────── */
export function LatestRead() {
  const list = sortedPosts().slice(0, 3);
  return (
    <section className="panel on-dark grain bg-coal fade dark:bg-black" aria-labelledby="latest-title">
      <div className="shell section relative z-[1]">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <Heading num="02" label="Latest read" id="latest-title" lead="Latest" tail="read" />
          <p className="max-w-sm text-muted">Ideas, teardowns and lessons from the week&apos;s work.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {list.map((p) => (
            <PostCard key={p.slug} p={{ ...p, cover: { ...p.cover, tone: "lilac" } }} variant="indigo" />
          ))}
        </div>
        <ViewAll href="/blog" />
      </div>
    </section>
  );
}

/* ── 03 Automations ───────────────────────────────────────────── */
function FlowVisual({ steps, caption }: { steps: ToolId[]; caption: string }) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((t, i) => {
          const tool = TOOLS[t] as { label: string; icon?: string };
          return (
            <div key={t} className="flex flex-1 items-center last:flex-none">
              <figure className="flex flex-col items-center gap-2">
                <span className="light-scope grid h-[72px] w-[72px] place-items-center rounded-[18px] border border-line bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {tool.icon ? <img src={tool.icon} alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" /> : null}
                </span>
                <figcaption className="text-xs text-muted">{tool.label}</figcaption>
              </figure>
              {i < steps.length - 1 ? <span className="mx-2 mb-6 h-px flex-1 bg-line" aria-hidden /> : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-[18px] bg-black px-5 py-4 text-[0.85rem] text-offwhite">
        <span className="mb-2 flex gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </span>
        {caption}
      </div>
    </div>
  );
}

export function Automations() {
  const list = sortedAutomations().slice(0, 3);
  return (
    <section className="tex-squares fade" aria-labelledby="auto-title">
      <div className="shell section">
        <Heading num="03" label="Automations" id="auto-title" lead="Marketing on" tail="autopilot." />
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <p className="max-w-md text-muted">
            Every hour you spend on repeat work is an hour your competitor spends on strategy. The gap grows every week. These are the workflows I use to stay on the right side of it.
          </p>
          <FlowVisual steps={["meta", "sheets", "gmail"]} caption="Every Monday 9:00 → pull last week's ads → send summary" />
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {list.map((a) => (
            <AutomationCard key={a.slug} a={a} />
          ))}
        </div>
        <ViewAll href="/automations" />
      </div>
    </section>
  );
}

/* ── 04 The AI edge ───────────────────────────────────────────── */
export function AiEdgeSection() {
  const list = sortedAiEdge().slice(0, 3);
  const prompt = "Write 20 hooks for a long-weekend bike rental ad";
  const out = "Here are the first three:\n1. Three days off. Don't spend them in traffic.\n2. The long weekend starts when you pick up the keys.\n3. Book the bike before the city does.";
  return (
    <section className="panel on-dark grain bg-[linear-gradient(160deg,#1a0b4b_0%,#2a1766_55%,#3b2672_100%)] fade" aria-labelledby="ai-title">
      <span aria-hidden className="absolute -right-24 -top-24 z-0 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(217,200,255,0.25),rgba(217,200,255,0.05))]" />
      <div className="shell section relative z-[1]">
        <Heading num="04" label="The AI edge" id="ai-title" lead="The AI" tail="edge." />
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <p className="max-w-md text-muted">
            Every marketer has access to the same AI tools. Very few know how to get real work out of them. Here&apos;s how I use AI for research, copy, creatives and planning, tested on real projects, and experiments.
          </p>
          <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <p className="ml-auto w-fit rounded-2xl bg-lilac px-4 py-2.5 text-[0.85rem] font-medium text-indigo">{prompt}</p>
            <div className="mt-4 flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20" aria-hidden>
                <Icon name="sparkles" size={15} />
              </span>
              <p className="whitespace-pre-line text-[0.85rem] leading-relaxed text-offwhite">{out}</p>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="flex gap-2" aria-hidden>
                <Cover cover={{ shape: "dots", tone: "indigo" }} className="h-11 w-11 rounded-lg" />
                <Cover cover={{ shape: "lines", tone: "lilac" }} className="h-11 w-11 rounded-lg" />
                <Cover cover={{ shape: "waves", tone: "indigo" }} className="h-11 w-11 rounded-lg" />
              </span>
              <CopyButton text={prompt} page="home" />
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {list.map((a) => (
            <AiEdgeCard key={a.slug} a={a} />
          ))}
        </div>
        <ViewAll href="/ai-edge" />
      </div>
    </section>
  );
}

/* ── 05 Templates ─────────────────────────────────────────────── */
export function TemplatesSection() {
  const fan = templates.slice(0, 3);
  return (
    <section className="panel on-lilac grain bg-[linear-gradient(160deg,#d3c1fa_0%,#dccdfb_60%,#e3d8fc_100%)] fade" aria-labelledby="tpl-title">
      <div className="shell section relative z-[1]">
        <Heading num="05" label="Templates" id="tpl-title" lead="Templates and" tail="Playbooks" />
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <p className="max-w-md text-muted">
            The fastest marketers aren&apos;t starting from zero. They&apos;re starting from a proven draft. These are the exact templates and playbooks I use for briefs, campaigns and reports, so your first version is already a good one.
          </p>
          <div className="relative mx-auto h-[220px] w-full max-w-[420px]" aria-hidden>
            {fan.map((t, i) => (
              <div
                key={t.slug}
                className="absolute top-4 w-[46%] rounded-[16px] bg-white p-2 shadow-xl"
                style={{ left: `${[2, 27, 52][i]}%`, rotate: `${[-8, 0, 8][i]}deg`, zIndex: i === 1 ? 2 : 1, top: i === 1 ? 0 : 20 }}
              >
                <Cover cover={{ ...t.cover, tone: "indigo" }} className="aspect-[4/3] rounded-[10px]" />
                <p className="mt-2 truncate px-1 text-[0.75rem] font-semibold text-indigo">{t.name}</p>
                <span className="mx-1 mt-1.5 block h-1.5 w-4/5 rounded-full bg-indigo/10" />
                <span className="mx-1 mb-2 mt-1 block h-1.5 w-3/5 rounded-full bg-indigo/10" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {templates.slice(0, 3).map((t) => (
            <TemplateCard key={t.slug} t={t} />
          ))}
        </div>
        <ViewAll href="/templates" />
      </div>
    </section>
  );
}

/* ── 06 Newsletter ────────────────────────────────────────────── */
export function NewsletterSection() {
  return (
    <section className="panel on-dark grain bg-coal fade dark:bg-black" aria-labelledby="nl-title">
      <div className="relative z-[1] grid lg:grid-cols-2">
        <div className="shell section !max-w-none lg:!pr-6">
          <Heading num="06" label="Newsletter" id="nl-title" lead="What moved in marketing" tail="this fortnight." />
        </div>
        <div className="m-2 rounded-[22px] bg-[linear-gradient(160deg,#2a1766,#4a2e8a)] p-6 sm:p-10 lg:m-2.5">
          <div className="pat h-full" data-shape="lines" style={{ ["--pat-ink" as string]: "rgb(217 200 255 / 0.08)" }}>
            <div className="relative z-[1] flex h-full flex-col justify-center gap-6">
              <p className="max-w-md text-[1.02rem] leading-relaxed text-offwhite">
                By the time a trend hits your feed, it&apos;s already old. Get what&apos;s moving in Indian marketing first: campaigns, launches, platform updates and AI, every two weeks.
              </p>
              <div className="max-w-md">
                <NewsletterForm location="home" />
                <p className="mt-3 text-[0.8125rem] text-[#c9c3dd]">Unsubscribe in one click, no hard feelings.</p>
              </div>
              <div className="max-w-md rounded-[18px] border border-white/10 bg-white/[0.04] p-2" aria-hidden>
                <div className="flex items-center gap-3 rounded-[14px] bg-white/[0.08] px-3 py-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-offwhite text-indigo">
                    <Cloche className="h-4 w-auto" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.8rem] font-semibold text-offwhite">Marketers Buffet</span>
                    <span className="block truncate text-[0.72rem] text-[#c9c3dd]">What moved in marketing this fortnight.</span>
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                </div>
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3 opacity-40">
                    <span className="h-7 w-7 rounded-full bg-white/10" />
                    <span className="flex-1 space-y-1.5">
                      <span className="block h-1.5 w-1/3 rounded-full bg-white/20" />
                      <span className="block h-1.5 w-3/4 rounded-full bg-white/10" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 07 Book a call ───────────────────────────────────────────── */
const SLOTS: Record<string, string[]> = {
  Mon: ["10:00", "14:30", "17:00"],
  Tue: ["11:00", "15:00", "18:00"],
  Wed: ["10:30", "13:00", "16:30"],
  Thu: ["09:30", "12:00", "17:30"],
  Fri: ["10:00", "14:00", "16:00"],
};

export function BookCall() {
  return (
    <section className="section fade" aria-labelledby="call-title">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading num="07" label="Book a call" id="call-title" lead="Need a second pair" tail="of eyes?" />
          <p className="mt-8 max-w-md text-muted">
            No big promises. Just an honest chat with someone who does marketing every day. Feedback, ideas or a fresh angle: if it helps, great. First 30 minutes free.
          </p>
        </div>
        <div className="pat relative overflow-hidden rounded-[24px] border border-line bg-surface p-6 sm:p-8" data-shape="circles" style={{ ["--pat-ink" as string]: "color-mix(in srgb, var(--mb-ink) 6%, transparent)" }}>
          <div className="relative z-[1]">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold text-ink">Intro call</span>
              <span className="text-sm text-muted">· 30 min ·</span>
              <span className="pill pill-lilac">Free</span>
            </p>
            <div className="mt-6 grid grid-cols-5 gap-2 text-center" aria-hidden>
              {Object.entries(SLOTS).map(([d, times]) => (
                <div key={d} className="grid gap-2">
                  <span className="text-[0.8rem] font-semibold text-ink">{d}</span>
                  {times.map((t) => (
                    <span key={t} className={`rounded-full border py-2 text-[0.75rem] font-medium ${d === "Wed" && t === "13:00" ? "border-indigo bg-indigo text-offwhite dark:border-lilac dark:bg-lilac dark:text-indigo" : "border-line text-ink"}`}>
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <Link href="/book-a-call" className="btn btn-primary mt-6 w-full">
              Book a call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Divider ──────────────────────────────────────────────────── */
export function Dashes() {
  return <div aria-hidden className="shell"><div className="h-3 w-full bg-[repeating-linear-gradient(-60deg,var(--mb-faint)_0_2px,transparent_2px_14px)] opacity-60 [mask:linear-gradient(90deg,#000_0_22%,transparent_22%_26%,#000_26%_36%,transparent_36%_40%,#000_40%)]" /></div>;
}

/* ── 08 Behind ────────────────────────────────────────────────── */
export function Behind() {
  return (
    <section className="section fade" aria-labelledby="behind-title">
      <div className="shell">
        <Heading num="08" label="Behind" id="behind-title" lead="Behind" tail="Marketers Buffet." />
        <ProfileCard className="mt-12" />
      </div>
    </section>
  );
}

export function ProfileCard({ className = "", link = true }: { className?: string; link?: boolean }) {
  return (
    <div className={`grid overflow-hidden rounded-[24px] border border-line bg-surface p-2 md:grid-cols-[1.25fr_1fr] ${className}`}>
      <div className="pat pat-indigo grain relative flex min-h-[280px] items-end rounded-[18px] p-7 md:min-h-[380px]" data-shape="linecircle">
        <p className="relative z-[1] text-[clamp(2.6rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-offwhite">
          Anupam
          <br />
          Harsh
        </p>
      </div>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <p className="text-[1.1rem] leading-relaxed text-ink">I do marketing every day at Royal Brothers. Marketers Buffet is where I write down what I learn.</p>
        <dl className="mt-6 divide-y divide-line border-y border-line text-[0.95rem]">
          <div className="py-3">
            <dt className="sr-only">Role</dt>
            <dd className="font-medium text-ink">{site.role}</dd>
          </div>
          <div className="py-3">
            <dt className="sr-only">Company</dt>
            <dd className="text-muted">{site.company}</dd>
          </div>
          <div className="py-3">
            <dt className="sr-only">City</dt>
            <dd className="text-muted">{site.city}</dd>
          </div>
          <div className="py-3">
            <dt className="sr-only">Phone</dt>
            <dd>
              <a href={site.phoneHref} className="link text-muted">
                {site.phone}
              </a>
            </dd>
          </div>
          <div className="py-3">
            <dt className="sr-only">Email</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="link text-muted">
                {site.email}
              </a>
            </dd>
          </div>
        </dl>
        {link ? (
          <Link href="/about" className="link mt-6 inline-flex items-center gap-1.5 font-semibold text-ink">
            Read my story <Icon name="arrow-right" size={16} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
