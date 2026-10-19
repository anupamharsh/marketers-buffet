/**
 * Content model. Field names mirror the brief's CMS spec so this file can be
 * replaced by a headless CMS (Sanity / Payload / Contentful) without touching UI.
 */

export type Format = "essay" | "teardown" | "quick-tip" | "ai-workflow";

export const FORMATS: { id: Format; label: string; plural: string }[] = [
  { id: "essay", label: "Essay", plural: "Essays" },
  { id: "teardown", label: "Teardown", plural: "Teardowns" },
  { id: "quick-tip", label: "Quick tip", plural: "Quick tips" },
  { id: "ai-workflow", label: "AI workflow", plural: "AI workflows" },
];

export const formatLabel = (f: Format) => FORMATS.find((x) => x.id === f)!.label;

/** Generated cover art (no stock photos). A CMS cover image can override it. */
export type Art =
  | { kind: "notification"; app: string; appLetter: string; title: string; body: string; time?: string; glow?: Glow }
  | { kind: "compare"; bad: string; good: string; glow?: Glow }
  | { kind: "quote"; text: string; glow?: Glow }
  | { kind: "stat"; value: string; text: string; glow?: Glow }
  | { kind: "search"; query: string; glow?: Glow }
  | { kind: "hooks"; lines: string[]; glow?: Glow }
  | { kind: "file"; name: string; files: FileType[]; glow?: Glow };

export type Glow = "mint" | "lavender" | "both" | "dark";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title?: string; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "code"; lang?: string; code: string }
  | { type: "compare"; bad: string; good: string; caption?: string }
  | { type: "notification"; app: string; appLetter: string; title: string; body: string; caption?: string }
  | { type: "stat"; value: string; text: string };

export type Post = {
  slug: string;
  /** Inline markup allowed: _serif_ and ==highlighted serif== */
  title: string;
  format: Format;
  topics: string[];
  hook: string;
  publishedAt: string;
  art: Art;
  coverImage?: { src: string; alt: string };
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  body: Block[];
};

export type FileType = "PDF" | "DOCX" | "Sheets" | "Excel" | "Notion" | "Canva" | "ZIP" | "Image" | "Link" | "Docs";

export type TemplateFile = { label: string; type: FileType; url?: string };

export type Template = {
  slug: string;
  name: string;
  line: string;
  price: number | null; // null = free. Paid prices are placeholders until the client confirms.
  files: TemplateFile[];
  art: Art;
  featured?: boolean;
  inside: string[];
  whoFor: string[];
  howTo: string[];
};

export type LibraryKind = "ad" | "hook" | "campaign";

export type LibraryItem = {
  id: string;
  kind: LibraryKind;
  title: string;
  brand: string;
  industry: string;
  ideas: string[];
  /** The artefact itself: the ad line, the hook, the campaign summary */
  sample: string;
  sub?: string;
  why: string;
  year: number;
};

export type Issue = {
  number: number;
  title: string;
  date: string;
  lesson: string;
  teardown: string;
  shortcut: string;
};
