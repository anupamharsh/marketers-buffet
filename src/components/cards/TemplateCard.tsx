import Link from "next/link";
import type { Template } from "@/content/types";
import { formatPrice } from "@/content/templates";
import { Art } from "@/components/ui/Art";
import { FileBadge } from "@/components/ui/Props";
import { IconArrow, IconDownload } from "@/components/ui/Icons";

export function TemplateCard({ t }: { t: Template }) {
  const free = t.price === null;
  return (
    <article className="group card lift relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line">
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
          <Art art={t.art} className="h-full w-full" />
        </div>
        <span className={`pill absolute left-4 top-4 ${free ? "pill-tag" : "pill-ink"}`}>{free ? "Free" : `Paid · ${formatPrice(t.price!)}`}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[1.45rem] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
          <Link href={`/templates/${t.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {t.name}
          </Link>
        </h3>
        <p className="mt-2.5 leading-relaxed text-slate">{t.line}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {t.files.map((f) => (
            <FileBadge key={f.label} type={f.type} />
          ))}
        </div>
        <span className={`btn btn-sm mt-6 self-start ${free ? "btn-primary" : "btn-ink"}`} aria-hidden>
          {free ? (
            <>
              <IconDownload size={17} /> Download
            </>
          ) : (
            <>
              Get it <IconArrow size={17} className="btn-arrow" />
            </>
          )}
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] ring-2 ring-transparent transition group-has-[:focus-visible]:ring-basil" />
    </article>
  );
}
