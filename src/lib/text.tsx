import { Fragment, type ReactNode } from "react";

/**
 * Tiny inline markup used across content:
 *   _words_      → Instrument Serif Italic (the 1-3 words that carry the feeling)
 *   ==words==    → serif italic + mint highlighter sweep
 *   **words**    → bold
 *   [label](url) → link
 */
const TOKEN = /(==[^=]+==|_[^_]+_|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function rich(text: string, opts: { serifClass?: string } = {}): ReactNode {
  const serifClass = opts.serifClass ?? "serif serif-basil";
  const parts = text.split(TOKEN).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("==") && part.endsWith("==")) {
      return (
        <span key={i} className={`${serifClass} hl`} data-hl>
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return (
        <span key={i} className={serifClass}>
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return (
        <a key={i} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Strip inline markup for meta tags, search, aria labels. */
export function plain(text: string): string {
  return text
    .replace(/==([^=]+)==/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function slugify(s: string) {
  return plain(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
