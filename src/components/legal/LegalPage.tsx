import type { ReactNode } from "react";
import { site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";

/*
 * Legal copy is a DRAFT based on the website brief (DPDP Act, refunds, terms).
 * It must be reviewed by a lawyer before launch.
 */
export function LegalPage({ title, updated, intro, children }: { title: string; updated: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageHero title={title} line={intro} glow="lavender" texture="tex-ruled" />
      <section className="pb-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_46rem_1fr]">
          <aside className="text-sm text-slate lg:pt-2">
            <p>Last updated</p>
            <p className="font-semibold text-ink">{updated}</p>
          </aside>
          <div className="prose-mb">
            {children}
            <h2>Contact</h2>
            <p>
              Questions, requests or complaints: <a href={`mailto:${site.email}`}>{site.email}</a>. Business name: Marketers Buffet.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
