import { sortedPosts } from "@/content/posts";
import { PostCard } from "@/components/cards/PostCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/motion/Reveal";

export function LatestPosts() {
  const list = sortedPosts();
  const featured = list.find((p) => p.featured) ?? list[0];
  const rest = list.filter((p) => p.slug !== featured.slug).slice(0, 5);

  return (
    <section className="relative py-24 md:py-32" aria-labelledby="latest-title">
      <div className="shell">
        <SectionHead
          id="latest-title"
          title="Recently _written down._"
          line="Lessons too useful to forget."
          action={{ href: "/blog", label: "Browse the blog" }}
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <PostCard post={featured} variant="feature" />
          </Reveal>
          <Reveal className="grid gap-5 lg:col-span-5 lg:row-span-2 lg:gap-6" stagger={0.1}>
            {rest.slice(0, 2).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </Reveal>
        </div>
        <Reveal className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-6" stagger={0.1}>
          {rest.slice(2, 5).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
