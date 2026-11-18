/**
 * Tool logos from the client asset pack (dashboard-icons Apache 2.0,
 * simple-icons CC0). `dark` is the variant for dark backgrounds.
 * Brand logos are trademarks of their owners; shown only to say which tool is used.
 */
export const TOOLS = {
  meta: { label: "Meta Ads", icon: "/icons/tools/meta.svg" },
  sheets: { label: "Google Sheets", icon: "/icons/tools/google-sheets.svg" },
  gmail: { label: "Gmail", icon: "/icons/tools/gmail.svg" },
  appsscript: { label: "Apps Script", icon: "/icons/tools/googleappsscript.svg" },
  chatgpt: { label: "ChatGPT", icon: "/icons/tools/chatgpt.svg" },
  claude: { label: "Claude", icon: "/icons/tools/claude-ai.svg" },
  canva: { label: "Canva", icon: "/icons/tools/canva.svg" },
  runway: { label: "Runway" }, // not in the pack: text-only until an official logo is added
  notion: { label: "Notion", icon: "/icons/tools/notion.svg", dark: "/icons/tools/notion-light.svg" },
  zapier: { label: "Zapier", icon: "/icons/tools/zapier.svg" },
  n8n: { label: "n8n", icon: "/icons/tools/n8n.svg" },
  calendar: { label: "Google Calendar", icon: "/icons/tools/google-calendar.svg" },
  drive: { label: "Google Drive", icon: "/icons/tools/google-drive.svg" },
  gemini: { label: "Gemini", icon: "/icons/tools/googlegemini.svg" },
  perplexity: { label: "Perplexity", icon: "/icons/tools/perplexity.svg" },
  figma: { label: "Figma", icon: "/icons/tools/figma.svg" },
  slack: { label: "Slack", icon: "/icons/tools/slack.svg" },
  whatsapp: { label: "WhatsApp", icon: "/icons/tools/whatsapp.svg" },
} as const satisfies Record<string, { label: string; icon?: string; dark?: string }>;

export type ToolId = keyof typeof TOOLS;
