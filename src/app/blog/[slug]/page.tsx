import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/content/blog";
import { postMinutes } from "@/content";
import { site } from "@/content/site";
import { formatDate, plain } from "@/lib/text";
import { Cover } from "@/components/ui/Cover";
import { TagPill } from "@/components/ui/Pills";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { Blocks, headingsOf } from "@/components/article/Blocks";
import { Toc } from "@/components/article/Toc";
import { ShareBar } from "@/components/article/ShareBar";
import { Comments } from "@/components/article/Comments";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { TrackView } from "@/components/article/TrackView";
import { Related, pickRelated } from "@/components/article/Related";
import { PostCard } from "@/components/cards";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  const title = plain(p.title);
  const description = p.seoDescription ?? p.hook;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title, description, publishedTime: p.date, authors: [site.owner] },
  };
}

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const title = plain(p.title);
  const toc = headingsOf(p.body);
  const related = pickRelated(posts, p, (x) => x.tag === p.tag);
  return (
    <>
      <ReadingProgress />
      <TrackView kind="blog" slug={p.slug} title={title} />
      <article>
        <header className="shell pt-32 md:pt-40">
          <div className="max-w-4xl">
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <TagPill>{p.tag}</TagPill>
              <span>{formatDate(p.date)}</span>
              <span aria-hidden>·</span>
              <span>{postMinutes(p.slug)} min read</span>
            </p>
            <h1 className="mt-6 text-[clamp(2.3rem,5.4vw,4.5rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink">{p.title}</h1>
            <p className="t-lead mt-6 max-w-2xl">{p.hook}</p>
            <div className="mt-8 flex items-center gap-3">
              <span className="pat pat-indigo grid h-11 w-11 place-items-center rounded-full text-sm font-semibold text-offwhite" data-shape="dots">
                <span className="relative z-[1]">AH</span>
              </span>
              <span className="leading-tight">
                <span className="block font-semibold text-ink">{site.owner}</span>
                <span className="block text-sm text-muted">
                  {site.role}, {site.company}
                </span>
              </span>
              <span className="ml-auto">
                <BookmarkButton kind="blog" slug={p.slug} title={title} />
              </span>
            </div>
          </div>
          <Cover cover={p.cover} priority sizes="(min-width: 1280px) 1180px, 100vw" className="mt-12 aspect-[21/9] rounded-[28px]" />
        </header>

        <div className="shell mt-12 grid gap-10 pb-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside>
            <Toc items={toc} />
          </aside>
          <div id="article-body" className="min-w-0">
            <aside aria-labelledby="takeaways" className="mb-12 max-w-[44rem] rounded-[22px] bg-indigo p-6 text-offwhite on-dark sm:p-7">
              <h2 id="takeaways" className="t-label !text-lilac">
                Key takeaways
              </h2>
              <ol className="mt-4 grid gap-3">
                {p.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lilac text-xs font-semibold text-indigo">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </aside>
            <Blocks blocks={p.body} page={`blog/${p.slug}`} />
            <ShareBar title={title} path={`/blog/${p.slug}`} />
          </div>
          <div className="max-w-[44rem] lg:col-start-2">
            <Comments kind="blog" slug={p.slug} />
          </div>
        </div>
      </article>
      <Related title="Related reads">
        {related.map((r) => (
          <PostCard key={r.slug} p={r} />
        ))}
      </Related>
    </>
  );
}
