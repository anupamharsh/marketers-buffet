import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { aiEdge, automations, posts, templates } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const pages = ["", "/blog", "/automations", "/ai-edge", "/templates", "/newsletter", "/book-a-call", "/about", "/privacy", "/terms", "/refunds", "/cookies"];
  return [
    ...pages.map((p) => ({ url: u(p || "/"), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...posts.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.date, priority: 0.8 })),
    ...automations.map((a) => ({ url: u(`/automations/${a.slug}`), lastModified: a.date, priority: 0.8 })),
    ...aiEdge.map((a) => ({ url: u(`/ai-edge/${a.slug}`), lastModified: a.date, priority: 0.8 })),
    ...templates.map((t) => ({ url: u(`/templates/${t.slug}`), priority: 0.8 })),
  ];
}
