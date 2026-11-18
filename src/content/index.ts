import { posts } from "./blog";
import { automations } from "./automations";
import { aiEdge } from "./ai-edge";
import { templates } from "./templates";
import { TOOLS } from "./tools";
import type { Block, Kind } from "./types";
import { plain, readMinutes } from "@/lib/text";

export { posts, automations, aiEdge, templates };

/** Plain text of a body, for read time and search. */
export function blocksText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "list":
          return b.items.join(" ");
        case "steps":
          return b.items.map((i) => `${i.title} ${i.text}`).join(" ");
        case "table":
          return [...b.head, ...b.rows.flat()].join(" ");
        case "code":
          return b.code;
        case "prompt":
          return `${b.prompt} ${b.output ?? ""}`;
        case "flow":
          return b.steps.map((s) => s.label).join(" ");
        case "gallery":
          return b.items.map((i) => i.alt).join(" ");
        case "beforeAfter":
          return `${b.before.alt} ${b.after.alt}`;
        case "image":
          return b.caption ?? "";
        case "video":
          return b.title;
        default:
          return b.text;
      }
    })
    .join(" ");
}

export const postMinutes = (slug: string) => {
  const p = posts.find((x) => x.slug === slug);
  return p ? readMinutes(blocksText(p.body)) : 1;
};

export const KIND_PATH: Record<Kind, string> = {
  blog: "/blog",
  automations: "/automations",
  "ai-edge": "/ai-edge",
  templates: "/templates",
};

export type SearchItem = { kind: Kind; label: string; title: string; sub: string; href: string; keywords: string };

/** Site-wide search index (handoff: blogs, automations, AI edge pages and templates). */
export function searchIndex(): SearchItem[] {
  return [
    ...posts.map((p) => ({ kind: "blog" as const, label: "Blog", title: plain(p.title), sub: p.hook, href: `/blog/${p.slug}`, keywords: p.tag })),
    ...automations.map((a) => ({
      kind: "automations" as const,
      label: "Automation",
      title: a.name,
      sub: a.what,
      href: `/automations/${a.slug}`,
      keywords: a.tools.map((t) => TOOLS[t].label).join(" "),
    })),
    ...aiEdge.map((a) => ({
      kind: "ai-edge" as const,
      label: "AI edge",
      title: a.title,
      sub: a.line,
      href: `/ai-edge/${a.slug}`,
      keywords: `${a.tag} ${a.tools.map((t) => TOOLS[t].label).join(" ")}`,
    })),
    ...templates.map((t) => ({
      kind: "templates" as const,
      label: "Template",
      title: t.name,
      sub: t.what,
      href: `/templates/${t.slug}`,
      keywords: `${t.formats.join(" ")} ${t.price === null ? "free" : "paid"}`,
    })),
  ];
}

/** Lookup used by bookmarks and the account page. */
export function findItem(kind: Kind, slug: string) {
  return searchIndex().find((i) => i.kind === kind && i.href.endsWith(`/${slug}`));
}
