import { Hero } from "@/components/home/Hero";
import { LatestPosts } from "@/components/home/LatestPosts";
import { StoryFind } from "@/components/home/StoryFind";
import { StoryBehind } from "@/components/home/StoryBehind";
import { StoryHow } from "@/components/home/StoryHow";
import { FeaturedTemplates } from "@/components/home/FeaturedTemplates";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CallTeaser } from "@/components/home/CallTeaser";

/*
 * Order follows the brief: "Homepage first view: a big bold hook, then latest
 * posts just below", then the three scroll stories, templates, newsletter, call.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <LatestPosts />
      <StoryFind />
      <StoryBehind />
      <StoryHow />
      <FeaturedTemplates />
      <NewsletterSection />
      <CallTeaser />
    </>
  );
}
