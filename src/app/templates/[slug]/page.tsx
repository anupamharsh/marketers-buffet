import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice, getTemplate, templates } from "@/content/templates";
import { Cover } from "@/components/ui/Cover";
import { FormatPill } from "@/components/ui/Pills";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { Icon } from "@/components/ui/Icon";
import { TemplateAction } from "@/components/templates/TemplateAction";
import { TrackView } from "@/components/article/TrackView";
import { Related } from "@/components/article/Related";
import { TemplateCard } from "@/components/cards";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTemplate((await params).slug);
  if (!t) return {};
  return {
    title: t.name,
    description: t.what,
    alternates: { canonical: `/templates/${t.slug}` },
    openGraph: { title: t.name, description: t.what },
  };
}

export default async function TemplatePage({ params }: Props) {
  const t = getTemplate((await params).slug);
  if (!t) notFound();
  const free = t.price === null;
  const related = templates.filter((x) => x.slug !== t.slug).slice(0, 3);
  return (
    <>
      <TrackView kind="templates" slug={t.slug} title={t.name} />
      <div className="shell grid gap-12 pb-20 pt-32 md:pt-40 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <Cover cover={t.cover} priority sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] rounded-[28px]" />
          {t.previews.length ? (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Previews from inside">
              {t.previews.slice(0, 4).map((p, i) => (
                <li key={i}>
                  <Cover cover={p} className="aspect-[4/3] rounded-[16px]" sizes="25vw" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-wrap items-center gap-1.5">
            {t.formats.map((f) => (
              <FormatPill key={f} f={f} />
            ))}
          </div>
          <h1 className="mt-5 text-[clamp(2.2rem,4.6vw,3.75rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink">{t.name}</h1>
          <p className="t-lead mt-4">{t.what}</p>
          <div className="mt-6 flex items-center gap-3">
            <p className="text-[2rem] font-semibold tracking-[-0.03em] text-ink">{free ? "Free" : formatPrice(t.price!)}</p>
            <span className="ml-auto">
              <BookmarkButton kind="templates" slug={t.slug} title={t.name} />
            </span>
          </div>
          <div className="mt-6 rounded-[22px] border border-line bg-surface p-5">
            <TemplateAction slug={t.slug} name={t.name} price={t.price} />
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <section aria-labelledby="inside">
              <h2 id="inside" className="t-h3 text-ink">
                What&apos;s inside
              </h2>
              <ul className="mt-4 grid gap-2.5">
                {t.inside.map((x) => (
                  <li key={x} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-1 text-violet">
                      <Icon name="check" size={16} />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="who">
              <h2 id="who" className="t-h3 text-ink">
                Who it&apos;s for
              </h2>
              <ul className="mt-4 grid gap-2.5">
                {t.whoFor.map((x) => (
                  <li key={x} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-1 text-violet">
                      <Icon name="user" size={16} />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Related title="More templates">
        {related.map((r) => (
          <TemplateCard key={r.slug} t={r} variant="light" />
        ))}
      </Related>
    </>
  );
}
