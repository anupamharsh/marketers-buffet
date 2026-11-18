import Link from "next/link";
import type { AiEdge, Automation, Post, Template } from "@/content/types";
import { Cover } from "@/components/ui/Cover";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { postMinutes } from "@/content";
import { formatPrice } from "@/content/templates";
import { formatDate } from "@/lib/text";
import { Card } from "@/components/ui/Card";
import { FormatPill, TagPill, ToolPill } from "@/components/ui/Pills";

type V = "light" | "indigo" | "paper";

export function PostCard({ p, variant = "light", h = 3 }: { p: Post; variant?: V; h?: 2 | 3 }) {
  return (
    <Card
      href={`/blog/${p.slug}`}
      kind="blog"
      slug={p.slug}
      cover={p.cover}
      variant={variant}
      headingLevel={h}
      tags={<TagPill>{p.tag}</TagPill>}
      title={p.title}
      line={p.hook}
      meta={
        <>
          <span>{formatDate(p.date)}</span>
          <span className="pill pill-outline">{postMinutes(p.slug)} min</span>
        </>
      }
      button="Read"
    />
  );
}

/** Large card for the featured post on top of /blog. Same parts, wider layout. */
export function FeaturedPost({ p }: { p: Post }) {
  return (
    <article className="card group relative !grid gap-2 md:grid-cols-[1.25fr_1fr]">
      <Cover cover={p.cover} priority sizes="(min-width: 768px) 55vw, 100vw" className="card-cover aspect-[16/10] md:aspect-auto md:min-h-[360px]" />
      <div className="card-body justify-center md:!p-8">
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="pill pill-lilac">Featured</span>
          <TagPill>{p.tag}</TagPill>
        </div>
        <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
          <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0 after:rounded-[24px] after:content-[''] focus-visible:outline-none">
            {p.title}
          </Link>
        </h2>
        <p className="mt-3 text-[1.02rem] leading-relaxed text-muted">{p.hook}</p>
        <div className="mt-8 flex items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-[0.8125rem] font-medium text-muted">
            <span>{formatDate(p.date)}</span>
            <span className="pill pill-outline">{postMinutes(p.slug)} min</span>
          </div>
          <span className="btn btn-sm btn-primary pointer-events-none" aria-hidden>
            Read
          </span>
          <span className="relative z-[1]">
            <BookmarkButton kind="blog" slug={p.slug} title={p.title} />
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-[24px] ring-2 ring-transparent group-has-[a:focus-visible]:ring-[var(--mb-focus)]" />
    </article>
  );
}

export function AutomationCard({ a, variant = "light", h = 3 }: { a: Automation; variant?: V; h?: 2 | 3 }) {
  return (
    <Card
      href={`/automations/${a.slug}`}
      kind="automations"
      slug={a.slug}
      cover={a.cover}
      variant={variant}
      headingLevel={h}
      tags={a.tools.map((t) => (
        <ToolPill key={t} id={t} />
      ))}
      title={a.name}
      line={a.what}
      meta={<span>{formatDate(a.date)}</span>}
      button="See how it works"
    />
  );
}

export function AiEdgeCard({ a, variant = "paper", h = 3 }: { a: AiEdge; variant?: V; h?: 2 | 3 }) {
  return (
    <Card
      href={`/ai-edge/${a.slug}`}
      kind="ai-edge"
      slug={a.slug}
      cover={a.cover}
      variant={variant}
      headingLevel={h}
      tags={<TagPill tone="lilac">{a.tag}</TagPill>}
      title={a.title}
      line={a.line}
      meta={
        <>
          <span>{formatDate(a.date)}</span>
          {a.tools.map((t) => (
            <ToolPill key={t} id={t} />
          ))}
        </>
      }
      button="Try it"
    />
  );
}

export function TemplateCard({ t, variant = "paper", h = 3 }: { t: Template; variant?: V; h?: 2 | 3 }) {
  return (
    <Card
      href={`/templates/${t.slug}`}
      kind="templates"
      slug={t.slug}
      cover={t.cover}
      variant={variant}
      headingLevel={h}
      tags={t.formats.map((f) => (
        <FormatPill key={f} f={f} />
      ))}
      title={t.name}
      line={t.what}
      meta={<span className="text-[0.95rem] font-semibold text-ink">{t.price === null ? "Free" : formatPrice(t.price)}</span>}
      button="Get it"
    />
  );
}
