import Link from "next/link";
import type { ReactNode } from "react";
import type { Cover as CoverT, Kind } from "@/content/types";
import { Cover } from "./Cover";
import { BookmarkButton } from "./BookmarkButton";

/**
 * The one shared card (handoff): equal heights, cover inset 8px with parallel
 * inner corners, 24px padding, fixed inner order:
 *   tag row → title → one line → meta row (meta, button, bookmark).
 * The whole card is clickable via the title link; the bookmark sits above it.
 */
export function Card({
  href,
  cover,
  tags,
  title,
  line,
  meta,
  button,
  kind,
  slug,
  variant = "light",
  headingLevel = 3,
  coverClass = "aspect-[16/10]",
  className = "",
}: {
  className?: string;
  href: string;
  cover: CoverT;
  tags?: ReactNode;
  title: string;
  line: string;
  meta?: ReactNode;
  button: string;
  kind: Kind;
  slug: string;
  /** light: theme surface · indigo: on coal panels · paper: always white (on indigo/lilac panels) */
  variant?: "light" | "indigo" | "paper";
  headingLevel?: 2 | 3;
  coverClass?: string;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`card group relative ${variant === "indigo" ? "card-indigo on-dark" : variant === "paper" ? "light-scope" : ""} ${className}`}>
      <Cover cover={cover} className={`card-cover ${coverClass}`} />
      <div className="card-body">
        {tags ? <div className="mb-3 flex min-h-[26px] flex-wrap items-center gap-1.5">{tags}</div> : null}
        <H className="t-h3 text-ink">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-[24px] after:content-[''] focus-visible:outline-none">
            {title}
          </Link>
        </H>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted">{line}</p>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-[0.8125rem] font-medium text-muted">{meta}</div>
          <span className="btn btn-sm btn-primary pointer-events-none" aria-hidden>
            {button}
          </span>
          <span className="relative z-[1]">
            <BookmarkButton kind={kind} slug={slug} title={title} />
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-[24px] ring-2 ring-transparent group-has-[a:focus-visible]:ring-[var(--mb-focus)]" />
    </article>
  );
}
