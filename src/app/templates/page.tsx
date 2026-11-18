import type { Metadata } from "next";
import { templates } from "@/content/templates";
import { PageIntro } from "@/components/ui/PageIntro";
import { FilterGrid } from "@/components/lists/FilterGrid";
import { TemplateCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "Templates and Playbooks",
  description: "The exact templates and playbooks I use for briefs, campaigns and reports. Free and paid.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return (
    <>
      <PageIntro label="Templates" lead="Templates and" tail="Playbooks">
        The fastest marketers aren&apos;t starting from zero. They&apos;re starting from a proven draft. These are the exact templates and playbooks I use for briefs, campaigns and reports, so your first version is already a good one.
      </PageIntro>
      <section className="shell pb-24" aria-label="Templates">
        <FilterGrid
          label="Filter by price"
          param="price"
          filters={[
            { value: "free", label: "Free" },
            { value: "paid", label: "Paid" },
          ]}
          items={templates.map((t) => ({
            id: t.slug,
            facets: [t.price === null ? "free" : "paid"],
            text: `${t.name} ${t.what} ${t.formats.join(" ")}`,
            node: <TemplateCard t={t} variant="light" h={2} />,
          }))}
        />
      </section>
    </>
  );
}
