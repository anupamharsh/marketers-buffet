import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate, templates } from "@/content/templates";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Art, Glows } from "@/components/ui/Art";
import { TemplateCard } from "@/components/cards/TemplateCard";
import { TemplateAction } from "@/components/templates/TemplateAction";
import { IconArrow, IconCheck } from "@/components/ui/Icons";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return { title: t.name, description: t.line, alternates: { canonical: `/templates/${t.slug}` } };
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();
  const more = templates.filter((x) => x.slug !== t.slug).slice(0, 3);

  const sections = [
    { title: "What's inside", items: t.inside, ordered: false },
    { title: "Who it's for", items: t.whoFor, ordered: false },
    { title: "How to use it", items: t.howTo, ordered: true },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pb-16 pt-32 md:pt-44">
        <div className="mask-fade-b pointer-events-none absolute inset-0 -z-10">
          <Glows glow={t.art.glow ?? "mint"} />
        </div>
        <div className="tex-grid mask-fade-b pointer-events-none absolute inset-0 -z-10" />
        <div className="shell">
          <Reveal>
            <Link href="/templates" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink">
              <IconArrow size={16} className="rotate-180" /> Templates
            </Link>
          </Reveal>
          <div className="mt-6 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <RevealText as="h1" mode="load" text={t.name} className="t-h1 max-w-[14ch] text-ink" />
              <Reveal delay={0.2}>
                <p className="t-lead mt-6 max-w-xl">{t.line}</p>
              </Reveal>

              {/* Preview: the cover plus two "pages" fanned behind it */}
              <Reveal delay={0.3} className="relative mt-12">
                <div className="absolute inset-x-10 -top-4 bottom-6 rotate-[-3deg] rounded-[24px] border border-line bg-white/70" aria-hidden />
                <div className="absolute inset-x-5 -top-2 bottom-3 rotate-[2deg] rounded-[24px] border border-line bg-white/90" aria-hidden />
                <div className="card relative overflow-hidden !rounded-[24px]">
                  <div className="aspect-[16/10]">
                    <Art art={t.art} size="lg" className="h-full w-full" />
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:pt-4">
              <div className="lg:sticky lg:top-32">
                <Reveal delay={0.25}>
                  <TemplateAction t={t} />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24" aria-label="Template details">
        <div className="shell grid gap-5 md:grid-cols-3 lg:gap-6">
          {sections.map((s) => (
            <Reveal key={s.title} className="card p-7">
              <h2 className="text-2xl font-bold tracking-[-0.035em] text-ink">{s.title}</h2>
              <ul className="mt-5 grid gap-3.5">
                {s.items.map((it, i) => (
                  <li key={it} className="flex gap-3 text-ink">
                    {s.ordered ? (
                      <span className="t-num w-6 shrink-0 text-2xl leading-none">{i + 1}</span>
                    ) : (
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-basil">
                        <IconCheck size={13} />
                      </span>
                    )}
                    <span className="leading-relaxed">{it}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-28" aria-labelledby="more-tpl">
        <div className="shell">
          <h2 id="more-tpl" className="t-h2 text-ink">
            More <span className="serif serif-basil">templates</span>
          </h2>
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.1}>
            {more.map((x) => (
              <TemplateCard key={x.slug} t={x} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
