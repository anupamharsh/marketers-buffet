import type { Template } from "./types";

/*
 * Paid prices are PLACEHOLDERS. The brief lists prices as an open decision.
 * File URLs are empty until real files are uploaded; the UI handles that.
 */
export const templates: Template[] = [
  {
    slug: "hooks-you-can-use",
    name: "Hooks you can use",
    line: "50 opening lines for posts, ads and emails, sorted by what you want people to feel.",
    price: null,
    featured: true,
    files: [
      { label: "Hook sheet", type: "PDF" },
      { label: "Editable copy", type: "Notion" },
    ],
    art: {
      kind: "hooks",
      lines: ["I was doing X. Turns out it was Y.", "Nobody notices this about [brand].", "Your ad answered X. They asked Y."],
      glow: "mint",
    },
    inside: [
      "50 hook formulas in 5 groups: curiosity, reversal, confession, number, everyday moment",
      "A real example under every formula",
      "A one-page checklist to test any hook in three seconds",
    ],
    whoFor: ["Junior marketers writing their first campaigns", "Founders posting on LinkedIn", "Anyone staring at a blank caption"],
    howTo: ["Pick the feeling you want first, not the formula", "Write three versions with different formulas", "Run the three-second test and keep the winner"],
  },
  {
    slug: "why-now-brief",
    name: "The Why Now campaign brief",
    line: "A one-page brief that forces the question every ad forgets: why should they act today?",
    price: null,
    featured: true,
    files: [
      { label: "Brief template", type: "DOCX" },
      { label: "Google Docs copy", type: "Docs" },
    ],
    art: { kind: "file", name: "Why Now brief", files: ["DOCX", "Docs"], glow: "lavender" },
    inside: ["One-page brief with prompts for each section", "A worked example for a bike rental brand", "A list of 30 everyday 'why now' moments"],
    whoFor: ["Marketers briefing designers or agencies", "Small teams who skip briefs because they take too long"],
    howTo: ["Fill it in before the first creative review", "Share it with whoever is writing the copy", "Check every ad against the 'why now' box"],
  },
  {
    slug: "ad-teardown-kit",
    name: "Ad teardown kit",
    line: "The exact frame I use to break down any ad into five decisions. Notion and Canva included.",
    price: 299,
    featured: true,
    files: [
      { label: "Teardown workspace", type: "Notion" },
      { label: "Carousel templates", type: "Canva" },
      { label: "Printable worksheet", type: "PDF" },
    ],
    art: { kind: "file", name: "Teardown kit", files: ["Notion", "Canva", "PDF"], glow: "both" },
    inside: ["A Notion database to log and tag ads", "Five-decision teardown worksheet", "Six Canva carousel layouts in the Marketers Buffet style"],
    whoFor: ["Marketers building a swipe file", "Creators who post teardowns", "Students preparing case studies"],
    howTo: ["Duplicate the Notion workspace", "Log one ad a day for two weeks", "Turn your best teardown into a carousel"],
  },
  {
    slug: "push-notification-swipe",
    name: "Push notification swipe deck",
    line: "120 push and in-app lines, rewritten from 'brand shouting' to 'friend texting'.",
    price: 199,
    files: [
      { label: "Swipe deck", type: "Sheets" },
      { label: "Excel copy", type: "Excel" },
    ],
    art: { kind: "compare", bad: "Don't miss our amazing sale!", good: "Your size is back. For now.", glow: "mint" },
    inside: ["120 before-and-after lines across 8 industries", "Tagged by trigger: cart, restock, price drop, milestone", "Character counts for iOS and Android"],
    whoFor: ["CRM and lifecycle marketers", "App founders writing their own notifications"],
    howTo: ["Filter by your trigger", "Adapt the 'after' line to your product", "Test against your current copy"],
  },
];

export const getTemplate = (slug: string) => templates.find((t) => t.slug === slug);

export const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;
