import { plain } from "@/lib/text";

type H = { id: string; text: string; level: number };

/** Contents list from the post's headings: sticky on desktop, a dropdown on mobile. */
export function Toc({ items }: { items: H[] }) {
  if (items.length < 2) return null;
  const list = (
    <ol className="grid gap-1 text-[0.9rem]">
      {items.map((h) => (
        <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
          <a href={`#${h.id}`} className="link inline-flex min-h-9 items-center leading-snug text-muted hover:text-ink">
            {plain(h.text)}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <details className="mb-8 rounded-[18px] border border-line bg-surface px-4 py-1 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-ink">Contents</summary>
        <nav aria-label="Contents" className="pb-3">
          {list}
        </nav>
      </details>
      <nav aria-label="Contents" className="sticky top-28 hidden lg:block">
        <p className="t-label mb-4">Contents</p>
        {list}
      </nav>
    </>
  );
}
