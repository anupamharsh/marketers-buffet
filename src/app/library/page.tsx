import type { Metadata } from "next";
import { Suspense } from "react";
import { library } from "@/content/library";
import { PageHero } from "@/components/ui/PageHero";
import { LibraryIndex } from "@/components/library/LibraryIndex";

export const metadata: Metadata = {
  title: "Resource library",
  description: "A swipe file of ads, hooks and campaigns. Tagged, searchable, always growing.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  return (
    <>
      <PageHero
        label="Swipe file"
        title="Steal like a ==marketer.=="
        line="Real examples to spark your next idea. Tagged, searchable, always growing."
        glow="mint"
      />
      <Suspense fallback={<div className="shell min-h-[60vh]" />}>
        <LibraryIndex items={library} />
      </Suspense>
    </>
  );
}
