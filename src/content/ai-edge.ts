import type { AiEdge } from "./types";

/* From the homepage design. Bodies are drafts for owner review. */
export const aiEdge: AiEdge[] = [
  {
    slug: "one-product-photo-five-ad-creatives",
    title: "One product photo, five ad creatives",
    tag: "Ad creative",
    line: "The exact prompts, and every output, from first try to final",
    tools: ["chatgpt", "canva"],
    date: "2026-11-11",
    cover: { shape: "waves", tone: "indigo" },
    body: [
      { type: "p", text: "Start with one clean product photo on a plain background. The goal: five ad directions in under an hour, then pick one to polish." },
      { type: "prompt", tool: "chatgpt", prompt: "You are a performance creative lead. Here is a product photo of a rental bike. Give me 5 ad concepts for a long-weekend campaign. For each: a 6-word headline, a scene description for the background, and the one emotion it targets.", output: "1. \"Three days. Zero traffic.\" Open highway at sunrise. Freedom.\n2. \"Your weekend has a key.\" Hand holding keys, blurred city behind. Anticipation.\n3. …" },
      { type: "beforeAfter", before: { alt: "Original product photo on plain background", label: "Before" }, after: { alt: "Generated ad creative with highway background", label: "After" } },
      { type: "gallery", items: [{ alt: "Concept 1 output" }, { alt: "Concept 2 output" }, { alt: "Concept 3 output" }] },
      { type: "steps", items: [
        { title: "Generate concepts", text: "Run the prompt. Keep the two concepts that you'd actually say out loud." },
        { title: "Build backgrounds", text: "Generate or find backgrounds for each scene; keep the product photo untouched." },
        { title: "Compose in Canva", text: "One frame per size: 1080×1350 feed, 1080×1920 story." },
      ] },
      { type: "callout", title: "Owner note", text: "Replace placeholder images with the real outputs." },
    ],
  },
  {
    slug: "15-second-reel-from-a-3-line-script",
    title: "A 15-second Reel from a 3-line script",
    tag: "AI video",
    line: "Script to scenes to final cut, with the tools used at each step",
    tools: ["claude", "runway"],
    date: "2026-11-07",
    cover: { shape: "linecircle", tone: "indigo" },
    body: [
      { type: "prompt", tool: "claude", prompt: "Turn this 3-line script into a 5-shot list for a 15-second vertical Reel. For each shot: duration, camera move, what's on screen, and on-screen text (max 5 words).\n\nScript:\nThree days off.\nDon't spend them in traffic.\nBook the bike before the city does.", output: "Shot 1 (3s) · slow push-in · empty office chair · \"Three days off.\"\nShot 2 (3s) · static · gridlocked flyover · \"Not in traffic.\"\n…" },
      { type: "video", title: "Final cut (placeholder)", caption: "Owner to add the finished Reel." },
      { type: "table", head: ["Step", "Tool", "Why this one"], rows: [["Shot list", "Claude", "Follows format rules reliably"], ["Clips", "Runway", "Short, controllable camera moves"], ["Edit + captions", "CapCut", "Fast vertical edits"]], caption: "Tool comparison" },
    ],
  },
  {
    slug: "seo-blog-draft-with-a-claude-project",
    title: "An SEO blog draft using a Claude project",
    tag: "Writing",
    line: "How I set up rules once, so every article comes out on-brief",
    tools: ["claude"],
    date: "2026-11-03",
    cover: { shape: "dots", tone: "indigo" },
    body: [
      { type: "p", text: "The trick is to stop re-explaining the brief. Put the rules in the project once, then every chat starts on-brief." },
      { type: "prompt", tool: "claude", prompt: "Project instructions:\n- Audience: Indian marketers, 2–5 years experience\n- Voice: plain, peer-level, short sentences, no hype words\n- Structure: H1, 1-line hook, 4–6 H2s, a 3-point key takeaways box\n- Always include one real Indian brand example\n- Never invent statistics; mark [NEEDS SOURCE] instead" },
      { type: "steps", items: [
        { title: "Create the project", text: "Paste the instructions and upload your style guide." },
        { title: "Brief per article", text: "Keyword, search intent, and one angle you believe." },
        { title: "Edit like a human", text: "Cut 20%. Add one thing only you would know." },
      ] },
    ],
  },
];

export const getAiEdge = (slug: string) => aiEdge.find((a) => a.slug === slug);
export const sortedAiEdge = () => [...aiEdge].sort((a, b) => b.date.localeCompare(a.date));
