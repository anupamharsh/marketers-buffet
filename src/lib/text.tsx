import { Fragment, type ReactNode } from "react";

/**
 * Tiny inline markup used in content:
 *   **words**    → bold
 *   `code`       → inline code
 *   [label](url) → link
 */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function rich(text: string): ReactNode {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`"))
        return (
          <code key={i} className="rounded-md bg-ink/[0.06] px-1.5 py-0.5 text-[0.9em]">
            {part.slice(1, -1)}
          </code>
        );
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

/** Strip inline markup for meta tags, search and aria labels. */
export function plain(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function slugify(s: string) {
  return plain(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Dates are always DD/MM/YY. Accepts an ISO date (YYYY-MM-DD). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

export function readMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}
