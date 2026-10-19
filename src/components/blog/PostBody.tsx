import type { Block } from "@/content/types";
import { rich, slugify } from "@/lib/text";
import { GoodBad, Notification } from "@/components/ui/Props";

/** Formats every post the same way, from structured blocks (maps 1:1 to CMS rich text). */
export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-mb">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{rich(b.text)}</p>;
          case "h2":
            return (
              <h2 key={i} id={slugify(b.text)}>
                {rich(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slugify(b.text)}>
                {rich(b.text)}
              </h3>
            );
          case "quote":
            return (
              <figure key={i} className="!my-12 border-l-2 border-basil pl-6 md:pl-8">
                <blockquote className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.04em] text-ink">
                  {rich(b.text)}
                </blockquote>
                {b.cite ? <figcaption className="mt-3 text-sm font-medium text-slate">{b.cite}</figcaption> : null}
              </figure>
            );
          case "callout":
            return (
              <aside key={i} className="relative !my-10 overflow-hidden rounded-[20px] bg-mint/70 p-6 md:p-7" aria-label={b.title ?? "Note"}>
                {b.title ? <p className="mb-1.5 font-semibold tracking-[-0.015em] text-basil">{b.title}</p> : null}
                <p className="text-ink">{rich(b.text)}</p>
              </aside>
            );
          case "list": {
            const L = b.ordered ? "ol" : "ul";
            return (
              <L key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{rich(it)}</li>
                ))}
              </L>
            );
          }
          case "table":
            return (
              <figure key={i} className="!my-10">
                <div className="card overflow-x-auto" tabIndex={0} role="region" aria-label={b.caption ?? "Table"}>
                  <table className="w-full min-w-[480px] border-collapse text-left text-[1rem]">
                    <thead>
                      <tr>
                        {b.head.map((h) => (
                          <th key={h} scope="col" className="border-b border-line px-5 py-3.5 text-sm font-semibold text-ink">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, j) => (
                        <tr key={j} className="border-b border-line last:border-0">
                          {r.map((c, k) => (
                            <td key={k} className={`px-5 py-3.5 ${k === r.length - 1 ? "font-medium text-ink" : "text-slate"}`}>
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.caption ? <figcaption className="mt-3 text-sm text-slate">{b.caption}</figcaption> : null}
              </figure>
            );
          case "code":
            return (
              <pre key={i} className="!my-8 overflow-x-auto rounded-[20px] bg-charcoal p-6 text-[0.92rem] leading-relaxed text-cream" tabIndex={0}>
                <code>{b.code}</code>
              </pre>
            );
          case "compare":
            return (
              <figure key={i} className="tex-ruled !my-12 rounded-[24px] border border-line bg-paper p-6 md:p-10">
                <GoodBad bad={b.bad} good={b.good} className="max-w-[480px]" />
                {b.caption ? <figcaption className="mt-5 text-sm font-medium text-slate">{b.caption}</figcaption> : null}
              </figure>
            );
          case "notification":
            return (
              <figure key={i} className="relative isolate !my-12 overflow-hidden rounded-[24px] border border-line bg-paper p-6 md:p-10">
                <span className="glow glow-mint -z-10" style={{ width: "600px", left: "-200px", bottom: "-380px" }} />
                <span className="glow glow-lavender -z-10" style={{ width: "500px", right: "-200px", top: "-300px" }} />
                <Notification app={b.app} letter={b.appLetter} title={b.title} body={b.body} />
                {b.caption ? <figcaption className="mt-5 text-sm font-medium text-slate">{b.caption}</figcaption> : null}
              </figure>
            );
          case "stat":
            return (
              <figure key={i} className="!my-12 flex flex-col gap-3 md:flex-row md:items-end md:gap-8">
                <span className="t-num text-[clamp(4.5rem,10vw,8rem)]">{b.value}</span>
                <figcaption className="max-w-[24ch] pb-3 text-lg font-medium text-slate">{b.text}</figcaption>
              </figure>
            );
        }
      })}
    </div>
  );
}
