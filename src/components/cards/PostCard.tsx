import Link from "next/link";
import { formatLabel, type Post } from "@/content/types";
import { readingTime } from "@/content/posts";
import { rich, plain } from "@/lib/text";
import { Art } from "@/components/ui/Art";
import { IconArrowUpRight, IconClock } from "@/components/ui/Icons";

export function PostCard({ post, variant = "default", headingLevel = 3 }: { post: Post; variant?: "feature" | "default"; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const feature = variant === "feature";
  return (
    <article className="group card lift relative flex h-full flex-col overflow-hidden">
      <div className={`relative overflow-hidden border-b border-line ${feature ? "aspect-[16/11] lg:aspect-auto lg:min-h-[340px] lg:flex-1" : "aspect-[16/10]"}`}>
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.035]">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <Art art={post.art} size={feature ? "lg" : "md"} className="h-full w-full" />
          )}
        </div>
      </div>
      <div className={`flex flex-col ${feature ? "p-7 sm:p-9" : "flex-1 p-6"}`}>
        <div className="mb-4 flex items-center gap-3">
          <span className="pill pill-tag">{formatLabel(post.format)}</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate">
            <IconClock size={15} /> {readingTime(post)} min read
          </span>
        </div>
        <H className={`font-bold tracking-[-0.035em] text-ink ${feature ? "text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.02]" : "text-[1.45rem] leading-[1.1]"}`}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none" aria-label={plain(post.title)}>
            {rich(post.title)}
          </Link>
        </H>
        <p className={`mt-3 text-slate ${feature ? "max-w-[46ch] text-lg" : "text-[1rem] leading-relaxed"}`}>{post.hook}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-basil">
          Read it
          <IconArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] ring-2 ring-transparent transition group-has-[:focus-visible]:ring-basil" />
    </article>
  );
}
