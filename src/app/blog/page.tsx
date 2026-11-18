import type { Metadata } from "next";
import { sortedPosts } from "@/content/blog";
import { BLOG_TAGS } from "@/content/types";
import { blocksText } from "@/content";
import { plain } from "@/lib/text";
import { PageIntro } from "@/components/ui/PageIntro";
import { FilterGrid } from "@/components/lists/FilterGrid";
import { FeaturedPost, PostCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ideas, teardowns and lessons from the week's work.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const all = sortedPosts();
  const featured = all.find((p) => p.featured) ?? all[0];
  return (
    <>
      <PageIntro label="Blog" lead="Latest" tail="read.">
        Ideas, teardowns and lessons from the week&apos;s work.
      </PageIntro>
      <section className="shell pb-24" aria-label="Posts">
        <FilterGrid
          label="Filter posts by tag"
          param="tag"
          searchable
          searchLabel="Search the blog"
          filters={BLOG_TAGS.map((t) => ({ value: t, label: t }))}
          featured={featured ? <FeaturedPost p={featured} /> : null}
          featuredId={featured?.slug}
          items={all.map((p) => ({
            id: p.slug,
            facets: [p.tag],
            text: `${plain(p.title)} ${p.hook} ${p.tag} ${blocksText(p.body)}`,
            node: <PostCard p={p} h={2} />,
          }))}
          empty="No posts match that yet. Try another tag or search."
        />
      </section>
    </>
  );
}
