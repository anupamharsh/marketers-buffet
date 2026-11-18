import type { ReactNode } from "react";
import type { Block, Cover as CoverT, Kind } from "@/content/types";
import { Cover } from "@/components/ui/Cover";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { Blocks } from "./Blocks";
import { ShareBar } from "./ShareBar";
import { Comments } from "./Comments";
import { TrackView } from "./TrackView";

/**
 * Shared layout for automation and AI edge pages: fixed header (title, line,
 * pills, date), flexible block body, sticky share bar, comments.
 */
export function DetailPage({
  kind,
  slug,
  title,
  line,
  pills,
  date,
  cover,
  body,
  children,
}: {
  kind: Exclude<Kind, "templates" | "blog">;
  slug: string;
  title: string;
  line: string;
  pills: ReactNode;
  date: string;
  cover: CoverT;
  body: Block[];
  children?: ReactNode;
}) {
  const path = `/${kind}/${slug}`;
  return (
    <>
      <TrackView kind={kind} slug={slug} title={title} />
      <article>
        <header className="shell pt-32 md:pt-40">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">{pills}</div>
              <h1 className="mt-6 text-[clamp(2.3rem,5.4vw,4.5rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink">{title}</h1>
              <p className="t-lead mt-6 max-w-2xl">{line}</p>
            </div>
            <div className="flex items-center gap-3 lg:justify-end">
              <span className="text-sm text-muted">{date}</span>
              <BookmarkButton kind={kind} slug={slug} title={title} />
            </div>
          </div>
          <Cover cover={cover} priority sizes="(min-width: 1280px) 1180px, 100vw" className="mt-12 aspect-[21/9] rounded-[28px]" />
        </header>
        <div className="shell mt-14 pb-16">
          <div id="article-body" className="mx-auto max-w-[44rem]">
            <Blocks blocks={body} page={path.slice(1)} />
            <ShareBar title={title} path={path} />
          </div>
          <div className="mx-auto max-w-[44rem]">
            <Comments kind={kind} slug={slug} />
          </div>
        </div>
      </article>
      {children}
    </>
  );
}
