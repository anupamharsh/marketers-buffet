"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";

/**
 * Sticky share bar. It sits at the end of the article container with
 * position: sticky, so it floats at the bottom of the screen while reading
 * and docks in place once the content ends. No JavaScript needed for that.
 */
export function ShareBar({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? window.location.origin : "") + path;
  const open = (platform: string, href: string) => {
    track({ event: "share", platform });
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=640");
  };
  const icon = (src: string, dark?: string) => (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={16} height={16} className={`h-4 w-4 ${dark ? "dark:hidden" : ""}`} />
      {dark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dark} alt="" width={16} height={16} className="hidden h-4 w-4 dark:block" />
      ) : null}
    </>
  );
  return (
    <div className="sticky bottom-4 z-[40] mt-14 flex max-w-[44rem] justify-center">
      <div role="group" aria-label="Share this page" className="flex items-center gap-1 rounded-full border border-line bg-surface/90 p-1.5 shadow-[var(--mb-card-shadow)] backdrop-blur-md">
        <span className="hidden px-3 text-sm font-medium text-muted sm:inline">Share</span>
        <button
          type="button"
          className="btn btn-sm btn-ghost !border-transparent"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url());
              setCopied(true);
              track({ event: "share", platform: "copy" });
              window.setTimeout(() => setCopied(false), 1800);
            } catch {}
          }}
          aria-live="polite"
        >
          <Icon name={copied ? "check" : "copy"} size={15} />
          {copied ? "Copied" : "Copy link"}
        </button>
        <button type="button" className="icon-btn !border-transparent" aria-label="Share on LinkedIn" onClick={() => open("linkedin", `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)}>
          {icon("/icons/tools/linkedin.svg")}
        </button>
        <button type="button" className="icon-btn !border-transparent" aria-label="Share on WhatsApp" onClick={() => open("whatsapp", `https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`)}>
          {icon("/icons/tools/whatsapp.svg")}
        </button>
        <button type="button" className="icon-btn !border-transparent" aria-label="Share on X" onClick={() => open("x", `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`)}>
          {icon("/icons/tools/x.svg", "/icons/tools/x-light.svg")}
        </button>
      </div>
    </div>
  );
}
