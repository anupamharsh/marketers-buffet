"use client";

import { useMemo, useRef, useState } from "react";
import type { Template } from "@/content/types";
import { useFlip } from "@/lib/useFlip";
import { TemplateCard } from "@/components/cards/TemplateCard";
import { ChipGroup, EmptyState, SelectField } from "@/components/ui/Filters";

type P = "all" | "free" | "paid";

export function TemplatesIndex({ templates }: { templates: Template[] }) {
  const [price, setPrice] = useState<P>("all");
  const [type, setType] = useState("all");
  const grid = useRef<HTMLDivElement>(null);
  const types = useMemo(() => Array.from(new Set(templates.flatMap((t) => t.files.map((f) => f.type)))).sort(), [templates]);

  const list = templates.filter(
    (t) =>
      (price === "all" || (price === "free" ? t.price === null : t.price !== null)) &&
      (type === "all" || t.files.some((f) => f.type === type)),
  );
  const capture = useFlip(grid, [list.map((t) => t.slug).join()]);

  return (
    <section className="pb-28" aria-label="All templates">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
          <ChipGroup
            label="Filter by price"
            value={price}
            onChange={(v) => {
              capture();
              setPrice(v);
            }}
            options={[
              { id: "all", label: "All" },
              { id: "free", label: "Free" },
              { id: "paid", label: "Paid" },
            ]}
          />
          <SelectField
            id="file-type"
            label="File type"
            value={type}
            onChange={(v) => {
              capture();
              setType(v);
            }}
            options={[{ id: "all", label: "Any" }, ...types.map((t) => ({ id: t, label: t }))]}
          />
        </div>
        <div ref={grid} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {list.length === 0 ? (
            <EmptyState
              onReset={() => {
                capture();
                setPrice("all");
                setType("all");
              }}
            />
          ) : (
            list.map((t) => (
              <div key={t.slug} data-flip-id={t.slug}>
                <TemplateCard t={t} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
