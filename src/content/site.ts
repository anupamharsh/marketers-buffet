import type { Issue } from "./types";

export const site = {
  name: "Marketers Buffet",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://marketersbuffet.com",
  description:
    "Marketing blogs, ad teardowns, quick tips, AI workflows and templates from a working marketer who writes down what's worth keeping.",
  email: "marketersbuffet@gmail.com", // placeholder until a domain email is set up
  instagram: "https://www.instagram.com/marketersbuffet",
  linkedin: "https://www.linkedin.com/company/marketersbuffet",
  handle: "@marketersbuffet",
};

export const nav = [
  { href: "/blog", label: "Blog" },
  { href: "/templates", label: "Templates" },
  { href: "/library", label: "Library" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
];

export const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refunds" },
  { href: "/cookie-policy", label: "Cookies" },
];

export const issues: Issue[] = [
  {
    number: 1,
    title: "The why-now issue",
    date: "2026-10-17",
    lesson: "Good isn't a reason to act today. Every ad needs a 'why now', and the best ones borrow it from the customer's calendar.",
    teardown: "A ride app's rain-delay notification: fact first, feeling second, and one small gift instead of an ask.",
    shortcut: "Add '…so what, I'll do it next week' to the end of your headline. If the ad has no answer, rewrite it.",
  },
];
