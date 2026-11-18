import type { Metadata } from "next";
import { sortedAutomations } from "@/content/automations";
import { TOOLS, type ToolId } from "@/content/tools";
import { blocksText } from "@/content";
import { PageIntro } from "@/components/ui/PageIntro";
import { FilterGrid } from "@/components/lists/FilterGrid";
import { AutomationCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "Automations",
  description: "Marketing on autopilot: the workflows I use so repeat work runs itself.",
  alternates: { canonical: "/automations" },
};

export default function AutomationsPage() {
  const all = sortedAutomations();
  // Filter chips only for tools that are actually used.
  const used = [...new Set(all.flatMap((a) => a.tools))] as ToolId[];
  return (
    <>
      <PageIntro label="Automations" lead="Marketing on" tail="autopilot.">
        Every hour you spend on repeat work is an hour your competitor spends on strategy. The gap grows every week. These are the workflows I use to stay on the right side of it.
      </PageIntro>
      <section className="shell pb-24" aria-label="Automations">
        <FilterGrid
          label="Filter automations by tool"
          param="tool"
          filters={used.map((t) => ({ value: t, label: TOOLS[t].label }))}
          items={all.map((a) => ({
            id: a.slug,
            facets: a.tools,
            text: `${a.name} ${a.what} ${blocksText(a.body)}`,
            node: <AutomationCard a={a} h={2} />,
          }))}
          empty="No automations use that tool yet."
        />
      </section>
    </>
  );
}
