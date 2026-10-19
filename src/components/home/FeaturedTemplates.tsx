import { templates } from "@/content/templates";
import { TemplateCard } from "@/components/cards/TemplateCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedTemplates() {
  const list = templates.filter((t) => t.featured).slice(0, 3);
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="tpl-title">
      <div className="shell">
        <SectionHead
          id="tpl-title"
          title="Don't start from _scratch._"
          line="Plug-and-play templates for hooks, campaigns and more."
          action={{ href: "/templates", label: "Get the templates" }}
        />
        <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.1}>
          {list.map((t) => (
            <TemplateCard key={t.slug} t={t} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
