import type { Automation } from "./types";

/* From the homepage design. Bodies are drafts for owner review. */
export const automations: Automation[] = [
  {
    slug: "weekly-meta-ads-report",
    name: "Weekly Meta ads report, on autopilot",
    what: "Pulls last week's ad numbers and sends a clean summary every Monday",
    tools: ["meta", "sheets", "gmail"],
    date: "2026-11-10",
    cover: { shape: "lines", tone: "indigo" },
    body: [
      { type: "flow", steps: [{ tool: "meta", label: "Pull last week's ads" }, { tool: "sheets", label: "Log and calculate" }, { tool: "gmail", label: "Send the summary" }], caption: "Every Monday 9:00" },
      { type: "p", text: "Every Monday I used to spend 40 minutes copying numbers from Ads Manager into a sheet and writing the same email. Now it runs before I open my laptop." },
      { type: "h2", text: "How it works" },
      { type: "steps", items: [
        { title: "Export to Sheets", text: "A scheduled export (or the Meta Ads add-on) writes last week's campaign rows into a tab called raw." },
        { title: "Calculate the summary", text: "A summary tab works out spend, CPC, CTR and cost per result, and compares them with the week before." },
        { title: "Email it", text: "An Apps Script trigger runs at 9:00 on Monday and sends the summary as a short email." },
      ] },
      { type: "h3", text: "The script" },
      { type: "code", lang: "javascript", code: "function sendWeeklyReport() {\n  const sh = SpreadsheetApp.getActive().getSheetByName('summary');\n  const rows = sh.getRange('A2:E10').getDisplayValues();\n  const body = rows.map(r => r.join('  ·  ')).join('\\n');\n  GmailApp.sendEmail('team@example.com', 'Meta ads: last week', body);\n}" },
      { type: "callout", title: "Before you copy it", text: "Change the email address and the range to match your sheet. Add a time-driven trigger: Weekly, Monday, 9–10am." },
    ],
  },
  {
    slug: "competitor-push-notification-tracker",
    name: "Competitor push notification tracker",
    what: "Logs what Zepto, Blinkit and Instamart send, so you can spot patterns",
    tools: ["sheets", "appsscript"],
    date: "2026-11-06",
    cover: { shape: "circles", tone: "indigo" },
    body: [
      { type: "flow", steps: [{ tool: "sheets", label: "Paste or forward notifications" }, { tool: "appsscript", label: "Tag time, brand and type" }, { tool: "sheets", label: "Weekly pattern view" }] },
      { type: "p", text: "Quick-commerce apps send a lot of notifications. Logging them for a month shows when each brand pushes, what triggers they use, and which words repeat." },
      { type: "steps", items: [
        { title: "Capture", text: "Screenshot or copy each notification into a form linked to a sheet." },
        { title: "Tag", text: "A script stamps the hour and day, and tags the type: offer, restock, reminder, content." },
        { title: "Review", text: "A pivot shows sends per brand per hour. Patterns appear within two weeks." },
      ] },
    ],
  },
  {
    slug: "campaign-calendar-alerts",
    name: "Campaign calendar alerts for the CX team",
    what: "Reminds support teams before every campaign goes live",
    tools: ["sheets", "gmail"],
    date: "2026-11-02",
    cover: { shape: "linecircle", tone: "indigo" },
    body: [
      { type: "flow", steps: [{ tool: "sheets", label: "Campaign calendar" }, { tool: "gmail", label: "Alert 24h before launch" }] },
      { type: "p", text: "Support hears about offers from customers first. That's backwards. One sheet and one daily script fixes it." },
      { type: "steps", items: [
        { title: "One row per campaign", text: "Name, start date, offer, terms, and the support FAQ link." },
        { title: "Daily check", text: "A script runs at 10:00 and finds campaigns starting tomorrow." },
        { title: "Send the brief", text: "It emails the CX group with the offer, terms and FAQ." },
      ] },
    ],
  },
];

export const getAutomation = (slug: string) => automations.find((a) => a.slug === slug);
export const sortedAutomations = () => [...automations].sort((a, b) => b.date.localeCompare(a.date));
