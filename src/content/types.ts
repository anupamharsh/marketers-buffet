/**
 * Content model. Field names follow the developer handoff so these files can
 * be replaced by the CMS without touching the UI.
 */
import type { ToolId } from "./tools";

export type Shape = "lines" | "dots" | "circles" | "waves" | "linecircle";
export type Tone = "indigo" | "lilac" | "coal";
export type Cover = { shape: Shape; tone?: Tone; image?: { src: string; alt: string } };

/** Flexible body blocks (handoff: "CMS blocks needed") */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "image"; src?: string; alt: string; caption?: string }
  | { type: "gallery"; items: { src?: string; alt: string; caption?: string }[] }
  | { type: "beforeAfter"; before: { src?: string; alt: string; label?: string }; after: { src?: string; alt: string; label?: string } }
  | { type: "video"; url?: string; title: string; caption?: string }
  | { type: "prompt"; prompt: string; output?: string; tool?: ToolId }
  | { type: "flow"; steps: { tool: ToolId; label: string }[]; caption?: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "code"; lang?: string; code: string }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; title?: string; text: string };

export const BLOG_TAGS = ["Essay", "Teardown", "Quick tip", "Case study"] as const;
export type BlogTag = (typeof BLOG_TAGS)[number];

export const AI_TAGS = ["Ad creative", "Poster", "AI video", "Writing", "Toolkit"] as const;
export type AiTag = (typeof AI_TAGS)[number];

export type Post = {
  slug: string;
  title: string;
  tag: BlogTag;
  hook: string;
  date: string; // ISO YYYY-MM-DD
  cover: Cover;
  featured?: boolean;
  takeaways: [string, string, string];
  body: Block[];
  seoDescription?: string;
};

export type Automation = {
  slug: string;
  name: string;
  what: string;
  tools: ToolId[];
  date: string;
  cover: Cover;
  body: Block[];
};

export type AiEdge = {
  slug: string;
  title: string;
  tag: AiTag;
  line: string;
  tools: ToolId[];
  date: string;
  cover: Cover;
  body: Block[];
};

export type Format = "PDF" | "Notion" | "Docs" | "Sheets" | "Canva" | "ZIP";

export type Template = {
  slug: string;
  name: string;
  what: string;
  /** null = free. Rupees. "[PRICE]" placeholder until the owner sets it. */
  price: number | null;
  priceTbd?: boolean;
  formats: Format[];
  cover: Cover;
  previews: Cover[];
  inside: string[];
  whoFor: string[];
  /** Object keys in the private "template-files" bucket */
  files: { label: string; key: string }[];
};

export type Kind = "blog" | "automations" | "ai-edge" | "templates";
