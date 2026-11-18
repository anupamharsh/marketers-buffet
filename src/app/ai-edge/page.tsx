import type { Metadata } from "next";
import { sortedAiEdge } from "@/content/ai-edge";
import { AI_TAGS } from "@/content/types";
import { TOOLS } from "@/content/tools";
import { blocksText } from "@/content";
import { PageIntro } from "@/components/ui/PageIntro";
import { FilterGrid } from "@/components/lists/FilterGrid";
import { AiEdgeCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "The AI edge",
  description: "How I use AI for research, copy, creatives and planning, with the exact prompts.",
  alternates: { canonical: "/ai-edge" },
};

export default function AiEdgePage() {
  const all = sortedAiEdge();
  return (
    <>
      <PageIntro label="AI in Marketing" lead="The AI" tail="edge.">
        Every marketer has access to the same AI tools. Very few know how to get real work out of them. Here&apos;s how I use AI for research, copy, creatives and planning, tested on real projects, and experiments.
      </PageIntro>
      <section className="shell pb-24" aria-label="AI edge pages">
        {/* Handoff: tag filter only, no tool filter. */}
        <FilterGrid
          label="Filter by type"
          param="tag"
          filters={AI_TAGS.map((t) => ({ value: t, label: t }))}
          items={all.map((a) => ({
            id: a.slug,
            facets: [a.tag],
            text: `${a.title} ${a.line} ${a.tools.map((t) => TOOLS[t].label).join(" ")} ${blocksText(a.body)}`,
            node: <AiEdgeCard a={a} variant="light" h={2} />,
          }))}
          empty="Nothing in that category yet. It's coming."
        />
      </section>
    </>
  );
}
