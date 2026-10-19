"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FORMATS, type Format, type Post } from "@/content/types";
import { plain } from "@/lib/text";
import { track } from "@/lib/analytics";
import { useFlip } from "@/lib/useFlip";
import { PostCard } from "@/components/cards/PostCard";
import { ChipGroup, EmptyState, SearchField, SelectField } from "@/components/ui/Filters";

type F = "all" | Format;
const PAGE = 9;

export function BlogIndex({ posts }: { posts: Post[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const initial = (params.get("format") as F) || "all";
  const [format, setFormat] = useState<F>(FORMATS.some((f) => f.id === initial) ? initial : "all");
  const [topic, setTopic] = useState("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const grid = useRef<HTMLDivElement>(null);

  const topics = useMemo(() => Array.from(new Set(posts.flatMap((p) => p.topics))).sort(), [posts]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (format === "all" || p.format === format) &&
        (topic === "all" || p.topics.includes(topic)) &&
        (!term || `${plain(p.title)} ${p.hook} ${p.topics.join(" ")}`.toLowerCase().includes(term)),
    );
  }, [posts, format, topic, q]);

  const capture = useFlip(grid, [filtered.map((p) => p.slug).join(), shown]);

  useEffect(() => {
    const search = format === "all" ? "" : `?format=${format}`;
    if (window.location.search !== search) router.replace(`/blog${search}`, { scroll: false });
  }, [format, router]);

  useEffect(() => {
    if (q.trim().length < 3) return;
    const t = window.setTimeout(() => track({ event: "site_search", search_term: q.trim().toLowerCase() }), 900);
    return () => window.clearTimeout(t);
  }, [q]);

  const reset = () => {
    capture();
    setFormat("all");
    setTopic("all");
    setQ("");
  };

  return (
    <section className="pb-28" aria-label="All posts">
      <div className="shell">
        <div className="sticky top-[72px] z-20 -mx-[clamp(1.25rem,5vw,5rem)] mb-10 flex flex-col gap-4 border-b border-line bg-paper/95 px-[clamp(1.25rem,5vw,5rem)] py-4 md:top-[84px] lg:flex-row lg:items-center lg:justify-between">
          <ChipGroup
            label="Filter by format"
            value={format}
            onChange={(v) => {
              capture();
              setFormat(v);
              setShown(PAGE);
            }}
            options={[
              { id: "all", label: "All", count: posts.length },
              ...FORMATS.map((f) => ({ id: f.id, label: f.plural, count: posts.filter((p) => p.format === f.id).length })),
            ]}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SelectField
              id="topic"
              label="Topic"
              value={topic}
              onChange={(v) => {
                capture();
                setTopic(v);
              }}
              options={[{ id: "all", label: "All topics" }, ...topics.map((t) => ({ id: t, label: t }))]}
            />
            <div className="sm:w-72">
              <SearchField
                id="blog-search"
                label="Search posts"
                value={q}
                onChange={(v) => {
                  capture();
                  setQ(v);
                }}
                placeholder="Search by topic, brand or idea…"
              />
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"} shown
        </p>

        <div ref={grid} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.length === 0 ? (
            <EmptyState onReset={reset} />
          ) : (
            filtered.slice(0, shown).map((p) => (
              <div key={p.slug} data-flip-id={p.slug}>
                <PostCard post={p} headingLevel={2} />
              </div>
            ))
          )}
        </div>

        {filtered.length > shown ? (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                capture();
                setShown((s) => s + 6);
              }}
            >
              Load more
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
