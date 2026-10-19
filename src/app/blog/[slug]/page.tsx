import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts, readingTime, relatedPosts } from "@/content/posts";
import { formatLabel } from "@/content/types";
import { site } from "@/content/site";
import { formatDate, plain, slugify } from "@/lib/text";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Art, Glows } from "@/components/ui/Art";
import { PostBody } from "@/components/blog/PostBody";
import { ReadingProgress, Share, Toc } from "@/components/blog/PostChrome";
import { Comments } from "@/components/blog/Comments";
import { PostCard } from "@/components/cards/PostCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Cloche } from "@/components/brand/Cloche";
import { IconArrow, IconClock } from "@/components/ui/Icons";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = post.seoTitle ?? plain(post.title);
  const description = post.seoDescription ?? post.hook;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: site.name }],
    openGraph: { type: "article", title, description, publishedTime: post.publishedAt, authors: [site.name] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const toc = post.body.filter((b) => b.type === "h2").map((b) => ({ id: slugify(b.text), text: plain(b.text) }));
  const related = relatedPosts(post);
  const mins = readingTime(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: plain(post.title),
    description: post.hook,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <ReadingProgress targetId="article" title={plain(post.title)} format={post.format} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="relative isolate overflow-hidden pb-12 pt-32 md:pt-44">
        <div className="mask-fade-b pointer-events-none absolute inset-0 -z-10">
          <Glows glow={post.art.glow ?? "mint"} />
        </div>
        <div className="tex-dots mask-fade-b pointer-events-none absolute inset-0 -z-10" />
        <div className="shell">
          <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-medium text-slate">
            <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-ink">
              <IconArrow size={16} className="rotate-180" /> Blog
            </Link>
            <span className="pill pill-tag">{formatLabel(post.format)}</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span className="flex items-center gap-1.5">
              <IconClock size={15} /> {mins} min read
            </span>
          </Reveal>
          <RevealText as="h1" mode="load" text={post.title} className="t-h1 mt-8 max-w-[18ch] text-ink" />
          <Reveal delay={0.25}>
            <p className="t-lead mt-7 max-w-[40rem]">{post.hook}</p>
            <p className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-line">
                <Cloche className="h-4 w-auto" />
              </span>
              Marketers Buffet
            </p>
          </Reveal>
        </div>
      </header>

      <div className="shell">
        <Reveal className="card overflow-hidden !rounded-[28px]">
          <div className="aspect-[16/9] md:aspect-[21/9]">
            <Art art={post.art} size="lg" className="h-full w-full" />
          </div>
        </Reveal>
      </div>

      <div className="shell mt-14 grid gap-12 md:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,46rem)_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <Toc items={toc} />
          </div>
        </aside>
        <article id="article" className="min-w-0">
          {toc.length ? (
            <details className="card mb-10 p-5 lg:hidden">
              <summary className="cursor-pointer font-semibold text-ink">On this page</summary>
              <ol className="mt-3 grid gap-1">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="inline-flex min-h-10 items-center text-slate">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
          <PostBody blocks={post.body} />

          <div className="mt-14 flex flex-wrap gap-2">
            {post.topics.map((t) => (
              <span key={t} className="pill pill-plain">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-10 border-t border-line pt-8">
            <Share title={plain(post.title)} path={`/blog/${post.slug}`} />
          </div>

          {/* End-of-post signup */}
          <div className="relative isolate mt-14 overflow-hidden rounded-[28px] bg-charcoal p-7 text-cream md:p-10">
            <span className="glow glow-basil -z-10" style={{ width: "700px", left: "-150px", bottom: "-450px" }} />
            <p className="text-[clamp(1.75rem,3vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.04em]">
              There&apos;s more where this <span className="serif text-mint">came from.</span>
            </p>
            <p className="mt-2 text-muted-cream">Every two weeks.</p>
            <div className="mt-7">
              <NewsletterForm location="post" dark button="Count me in" smallPrint={null} />
            </div>
          </div>

          <div className="mt-14" id="comments">
            <Comments slug={post.slug} />
          </div>
        </article>
        <div className="hidden lg:block" />
      </div>

      <section className="py-24 md:py-32" aria-labelledby="related-title">
        <div className="shell">
          <h2 id="related-title" className="t-h2 text-ink">
            You might also <span className="serif serif-basil">like</span>
          </h2>
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.1}>
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
