export const site = {
  name: "Marketers Buffet",
  owner: "Anupam Harsh",
  role: "Marketing Executive",
  company: "Royal Brothers",
  city: "Bengaluru",
  phone: "+91 94709 83868",
  phoneHref: "tel:+919470983868",
  email: "marketersbuffet@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://marketersbuffet.netlify.app",
  description: "Blogs, automations, AI-in-marketing examples and templates from a working marketer in India.",
  instagram: "https://www.instagram.com/marketersbuffet/",
  linkedin: "https://www.linkedin.com/in/anupamh/",
  tagline: "The work behind the work.",
};

/** Navbar items (handoff): no other links. */
export const nav = [
  { href: "/blog", label: "Blog" },
  { href: "/automations", label: "Automations" },
  { href: "/ai-edge", label: "AI in Marketing" },
  { href: "/templates", label: "Templates" },
  { href: "/newsletter", label: "Newsletter" },
];

export const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refunds", label: "Refunds" },
  { href: "/cookies", label: "Cookies" },
];

export const CALL_TOPICS = ["Campaign feedback", "Content strategy", "Career guidance", "Freelance projects"];

export const SKILLS = [
  "Brand Strategy",
  "Social Media",
  "Personal Branding",
  "CRM",
  "Influencer campaigns",
  "Performance ads",
  "Newsletters",
  "Automation",
  "AI in marketing",
];
