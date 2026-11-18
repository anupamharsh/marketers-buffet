import { TOOLS, type ToolId } from "@/content/tools";
import type { Format } from "@/content/types";

/** Tool pill with the brand logo from the asset pack. */
export function ToolPill({ id }: { id: ToolId }) {
  const t = TOOLS[id] as { label: string; icon?: string; dark?: string };
  return (
    <span className="pill pill-lilac pill-tool">
      {t.icon ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.icon} alt="" width={13} height={13} className={t.dark ? "dark:hidden" : ""} />
          {t.dark ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.dark} alt="" width={13} height={13} className="hidden dark:block" />
          ) : null}
        </>
      ) : null}
      {t.label}
    </span>
  );
}

export function FormatPill({ f }: { f: Format }) {
  if (f === "Notion") return <ToolPill id="notion" />;
  if (f === "Canva") return <ToolPill id="canva" />;
  return <span className="pill pill-lilac">{f}</span>;
}

export function TagPill({ children, tone = "outline" }: { children: React.ReactNode; tone?: "outline" | "lilac" }) {
  return <span className={`pill ${tone === "lilac" ? "pill-lilac" : "pill-outline"}`}>{children}</span>;
}
