import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { posts } from "@/content/posts";
import { templates } from "@/content/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/blog", "/templates", "/library", "/newsletter", "/about", "/book-a-call", "/privacy", "/terms", "/refund-policy", "/cookie-policy"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.publishedAt, priority: 0.8 })),
    ...templates.map((t) => ({ url: `${site.url}/templates/${t.slug}`, priority: 0.7 })),
  ];
}
