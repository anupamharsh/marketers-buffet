import type { Template } from "./types";

/*
 * From the homepage design. File keys point to objects in the private
 * "template-files" Supabase bucket; upload the real files with those names.
 */
export const templates: Template[] = [
  {
    slug: "viral-reel-playbook",
    name: "Viral Reel Playbook",
    what: "Hooks, formats and editing beats behind Reels that travel",
    // PLACEHOLDER price for testing. The owner will confirm the real price.
    price: 199,
    priceTbd: true,
    formats: ["PDF", "Notion"],
    cover: { shape: "circles", tone: "coal" },
    previews: [{ shape: "circles", tone: "indigo" }, { shape: "lines", tone: "lilac" }, { shape: "waves", tone: "coal" }],
    inside: ["30 hook patterns with examples", "6 Reel formats that travel, with beat sheets", "Editing checklist: cuts, captions, sound", "A posting tracker in Notion"],
    whoFor: ["Brand marketers running Instagram", "Creators who want repeatable formats", "Founders posting their own Reels"],
    files: [{ label: "Playbook (PDF)", key: "viral-reel-playbook/playbook.pdf" }],
  },
  {
    slug: "hooks-you-can-use",
    name: "Hooks you can use",
    what: "50 opening lines for posts, ads and emails, sorted by feeling",
    price: null,
    formats: ["PDF", "Notion"],
    cover: { shape: "lines", tone: "coal" },
    previews: [{ shape: "lines", tone: "indigo" }, { shape: "dots", tone: "lilac" }],
    inside: ["50 hook formulas in 5 feelings", "A real example under every formula", "The three-second hook test"],
    whoFor: ["Junior marketers writing first campaigns", "Founders posting on LinkedIn", "Anyone staring at a blank caption"],
    files: [{ label: "Hook sheet (PDF)", key: "hooks-you-can-use/hooks.pdf" }],
  },
  {
    slug: "why-now-campaign-brief",
    name: "The Why Now campaign brief",
    what: "A one-page brief that forces the question: why act today?",
    price: null,
    formats: ["Docs", "PDF"],
    cover: { shape: "dots", tone: "coal" },
    previews: [{ shape: "dots", tone: "indigo" }, { shape: "linecircle", tone: "lilac" }],
    inside: ["One-page brief with prompts per section", "A worked example for a bike rental brand", "30 everyday why-now moments"],
    whoFor: ["Marketers briefing designers or agencies", "Small teams who skip briefs"],
    files: [{ label: "Brief (PDF)", key: "why-now-campaign-brief/brief.pdf" }],
  },
];

export const getTemplate = (slug: string) => templates.find((t) => t.slug === slug);
export const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;
