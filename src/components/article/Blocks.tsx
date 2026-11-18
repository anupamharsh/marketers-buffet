import Image from "next/image";
import type { Block } from "@/content/types";
import { TOOLS, type ToolId } from "@/content/tools";
import { rich, slugify } from "@/lib/text";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolPill } from "@/components/ui/Pills";
import { Icon } from "@/components/ui/Icon";
import { BeforeAfter } from "./BeforeAfter";

/** Headings in a body, for the contents list. */
export function headingsOf(blocks: Block[]) {
  return blocks.flatMap((b) => (b.type === "h2" || b.type === "h3" ? [{ id: slugify(b.text), text: b.text, level: b.type === "h2" ? 2 : 3 }] : []));
}

function Media({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (src) {
    return <Image src={src} alt={alt} width={1600} height={1000} sizes="(min-width: 768px) 44rem, 100vw" className={`h-auto w-full rounded-[18px] border border-line ${className}`} />;
  }
  // Placeholder until the owner uploads the real image.
  return (
    <div role="img" aria-label={alt} className={`pat grain pat-lilac grid aspect-[16/10] place-items-center rounded-[18px] p-6 text-center ${className}`} data-shape="dots">
      <span className="relative z-[1] text-sm font-medium text-indigo">{alt}</span>
    </div>
  );
}

function ToolTile({ id }: { id: ToolId }) {
  const t = TOOLS[id] as { label: string; icon?: string };
  return (
    <span className="light-scope grid h-16 w-16 place-items-center rounded-[16px] border border-line bg-white shadow-sm">
      {t.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.icon} alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
      ) : (
        <span className="text-xs font-semibold text-indigo">{t.label}</span>
      )}
    </span>
  );
}

function youtubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function render(b: Block, i: number, page: string) {
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
    case "image":
      return (
        <figure key={i}>
          <Media src={b.src} alt={b.alt} />
          {b.caption ? <figcaption className="mt-2 text-sm text-muted">{b.caption}</figcaption> : null}
        </figure>
      );
    case "gallery":
      return (
        <div key={i} className="grid gap-3 sm:grid-cols-2">
          {b.items.map((g, j) => (
            <figure key={j} className={b.items.length % 2 === 1 && j === 0 ? "sm:col-span-2" : ""}>
              <Media src={g.src} alt={g.alt} />
              {g.caption ? <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      );
    case "beforeAfter":
      return <BeforeAfter key={i} before={b.before} after={b.after} />;
    case "video": {
      const yt = b.url ? youtubeId(b.url) : null;
      return (
        <figure key={i}>
          {yt ? (
            <div className="relative aspect-video overflow-hidden rounded-[18px] border border-line">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${yt}`}
                title={b.title}
                loading="lazy"
                allow="encrypted-media; picture-in-picture; fullscreen"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : b.url ? (
            <video src={b.url} controls preload="metadata" className="w-full rounded-[18px] border border-line" aria-label={b.title} />
          ) : (
            <div role="img" aria-label={b.title} className="pat grain pat-indigo grid aspect-video place-items-center rounded-[18px]" data-shape="circles">
              <span className="relative z-[1] flex items-center gap-2 text-sm font-medium text-offwhite">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-offwhite/15">▶</span>
                {b.title}
              </span>
            </div>
          )}
          {b.caption ? <figcaption className="mt-2 text-sm text-muted">{b.caption}</figcaption> : null}
        </figure>
      );
    }
    case "prompt":
      return (
        <div key={i} className="overflow-hidden rounded-[22px] border border-line bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon name="sparkles" size={16} /> Prompt
              {b.tool ? <ToolPill id={b.tool} /> : null}
            </span>
            <CopyButton text={b.prompt} page={page} label="Copy prompt" variant="primary" />
          </div>
          <pre className="whitespace-pre-wrap break-words px-5 py-4 font-sans text-[1rem] leading-relaxed text-ink">{b.prompt}</pre>
          {b.output ? (
            <div className="border-t border-line bg-lilac-soft/60 px-5 py-4 dark:bg-white/[0.04]">
              <p className="t-label mb-2">Output</p>
              <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-ink">{b.output}</p>
            </div>
          ) : null}
        </div>
      );
    case "flow":
      return (
        <figure key={i} className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
          <ol className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {b.steps.map((s, j) => (
              <li key={j} className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:text-center">
                <ToolTile id={s.tool} />
                <span className="text-[0.9rem] leading-snug text-ink">
                  <span className="block text-xs text-muted">{TOOLS[s.tool].label}</span>
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
          {b.caption ? (
            <figcaption className="mt-5 rounded-[14px] bg-black px-4 py-3 text-[0.85rem] text-offwhite">{b.caption}</figcaption>
          ) : null}
        </figure>
      );
    case "steps":
      return (
        <ol key={i} className="!list-none !pl-0 grid gap-3">
          {b.items.map((s, j) => (
            <li key={j} className="!mt-0 flex gap-4 rounded-[18px] border border-line bg-surface p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo text-sm font-semibold text-offwhite dark:bg-lilac dark:text-indigo">{j + 1}</span>
              <span>
                <span className="block font-semibold leading-snug text-ink">{s.title}</span>
                <span className="mt-1 block text-[1rem] leading-relaxed text-muted">{rich(s.text)}</span>
              </span>
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <div key={i} className="overflow-hidden rounded-[18px] bg-black text-offwhite">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
            <span className="text-xs text-[#c9c3dd]">{b.lang ?? "code"}</span>
            <span className="on-dark">
              <CopyButton text={b.code} page={page} />
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 text-[0.85rem] leading-relaxed">
            <code>{b.code}</code>
          </pre>
        </div>
      );
    case "table":
      return (
        <figure key={i}>
          <div className="overflow-x-auto rounded-[18px] border border-line">
            <table className="w-full min-w-[480px] border-collapse text-left text-[0.95rem]">
              <thead className="bg-surface">
                <tr>
                  {b.head.map((h, j) => (
                    <th key={j} scope="col" className="border-b border-line px-4 py-3 font-semibold text-ink">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, j) => (
                  <tr key={j} className="border-b border-line last:border-0">
                    {r.map((c, k) => (
                      <td key={k} className="px-4 py-3 align-top text-muted">
                        {rich(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.caption ? <figcaption className="mt-2 text-sm text-muted">{b.caption}</figcaption> : null}
        </figure>
      );
    case "quote":
      return (
        <blockquote key={i} className="my-10 border-l-2 border-violet pl-6">
          <p className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-ink">{rich(b.text)}</p>
          {b.cite ? <cite className="mt-3 block text-sm not-italic text-muted">{b.cite}</cite> : null}
        </blockquote>
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
    case "callout":
      return (
        <aside key={i} className="rounded-[18px] border border-line bg-lilac-soft/60 p-5 dark:bg-white/[0.04]">
          {b.title ? <p className="font-semibold text-ink">{b.title}</p> : null}
          <p className="mt-1 text-[1rem] leading-relaxed text-muted">{rich(b.text)}</p>
        </aside>
      );
  }
}

/** Renders CMS body blocks in any order inside the article column. */
export function Blocks({ blocks, page }: { blocks: Block[]; page: string }) {
  return <div className="prose-mb text-ink">{blocks.map((b, i) => render(b, i, page))}</div>;
}
