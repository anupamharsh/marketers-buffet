import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { automations, getAutomation } from "@/content/automations";
import { formatDate } from "@/lib/text";
import { ToolPill } from "@/components/ui/Pills";
import { DetailPage } from "@/components/article/DetailPage";
import { Related, pickRelated } from "@/components/article/Related";
import { AutomationCard } from "@/components/cards";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return automations.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getAutomation((await params).slug);
  if (!a) return {};
  return {
    title: a.name,
    description: a.what,
    alternates: { canonical: `/automations/${a.slug}` },
    openGraph: { type: "article", title: a.name, description: a.what, publishedTime: a.date },
  };
}

export default async function AutomationPage({ params }: Props) {
  const a = getAutomation((await params).slug);
  if (!a) notFound();
  // Handoff: 3 related automations, no link to templates.
  const related = pickRelated(automations, a, (x) => x.tools.some((t) => a.tools.includes(t)));
  return (
    <DetailPage
      kind="automations"
      slug={a.slug}
      title={a.name}
      line={a.what}
      date={formatDate(a.date)}
      cover={a.cover}
      body={a.body}
      pills={a.tools.map((t) => (
        <ToolPill key={t} id={t} />
      ))}
    >
      <Related title="More automations">
        {related.map((r) => (
          <AutomationCard key={r.slug} a={r} />
        ))}
      </Related>
    </DetailPage>
  );
}
