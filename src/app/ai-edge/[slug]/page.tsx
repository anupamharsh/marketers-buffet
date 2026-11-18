import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aiEdge, getAiEdge } from "@/content/ai-edge";
import { formatDate } from "@/lib/text";
import { TagPill, ToolPill } from "@/components/ui/Pills";
import { DetailPage } from "@/components/article/DetailPage";
import { Related, pickRelated } from "@/components/article/Related";
import { AiEdgeCard } from "@/components/cards";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return aiEdge.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getAiEdge((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.line,
    alternates: { canonical: `/ai-edge/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.line, publishedTime: a.date },
  };
}

export default async function AiEdgeDetail({ params }: Props) {
  const a = getAiEdge((await params).slug);
  if (!a) notFound();
  const related = pickRelated(aiEdge, a, (x) => x.tag === a.tag);
  return (
    <DetailPage
      kind="ai-edge"
      slug={a.slug}
      title={a.title}
      line={a.line}
      date={formatDate(a.date)}
      cover={a.cover}
      body={a.body}
      pills={
        <>
          <TagPill tone="lilac">{a.tag}</TagPill>
          {a.tools.map((t) => (
            <ToolPill key={t} id={t} />
          ))}
        </>
      }
    >
      <Related title="Try these next">
        {related.map((r) => (
          <AiEdgeCard key={r.slug} a={r} variant="light" />
        ))}
      </Related>
    </DetailPage>
  );
}
