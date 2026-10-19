import type { Metadata } from "next";
import { templates } from "@/content/templates";
import { PageHero } from "@/components/ui/PageHero";
import { TemplatesIndex } from "@/components/templates/TemplatesIndex";

export const metadata: Metadata = {
  title: "Templates",
  description: "Free and paid templates for hooks, campaigns and everyday marketing work.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return (
    <>
      <PageHero
        label="Start with: Hooks you can use"
        title="Templates that do the _heavy lifting._"
        line="Free and paid templates for hooks, campaigns and everyday marketing work."
        glow="lavender"
        texture="tex-grid"
      />
      <TemplatesIndex templates={templates} />
    </>
  );
}
