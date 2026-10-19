import type { Metadata } from "next";
import { Suspense } from "react";
import { sortedPosts } from "@/content/posts";
import { PageHero } from "@/components/ui/PageHero";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { PostCard } from "@/components/cards/PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Essays, ad teardowns, quick tips and AI workflows. Two minutes or twenty.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = sortedPosts();
  return (
    <>
      <PageHero title="Read what _you need._" line="Two minutes or twenty. Filter by format and dive in." glow="mint" />
      {/* Fallback is the full server-rendered list, so posts are in the HTML for SEO and no-JS visitors. */}
      <Suspense
        fallback={
          <div className="shell grid gap-5 pb-28 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} headingLevel={2} />
            ))}
          </div>
        }
      >
        <BlogIndex posts={posts} />
      </Suspense>
    </>
  );
}
