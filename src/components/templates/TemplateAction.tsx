"use client";

import Link from "next/link";
import type { Template } from "@/content/types";
import { formatPrice } from "@/content/templates";
import { track } from "@/lib/analytics";
import { toast } from "@/components/ui/Toaster";
import { FileBadge } from "@/components/ui/Props";
import { IconArrow, IconDownload, IconLock } from "@/components/ui/Icons";

/**
 * Download (free) or buy (paid).
 * TODO(payments): the gateway is still an open decision. "Get it" should create
 * a checkout session server-side; paid files unlock only via a signed,
 * expiring link emailed after payment. Never expose paid file URLs here.
 */
export function TemplateAction({ t }: { t: Template }) {
  const free = t.price === null;

  const download = (fileType: string, url?: string) => {
    track({ event: "template_download", template_name: t.name, file_type: fileType });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    toast("It's yours. Go make something good.");
  };

  return (
    <div className="card p-6 md:p-7">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate">{free ? "Free template" : "Paid template"}</span>
        {free ? <span className="pill pill-tag">Free</span> : <span className="t-num text-4xl">{formatPrice(t.price!)}</span>}
      </div>

      <ul className="mt-6 grid gap-2.5" aria-label="Files included">
        {t.files.map((f) => (
          <li key={f.label} className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
            <span className="flex items-center gap-3">
              <FileBadge type={f.type} />
              <span className="font-medium text-ink">{f.label}</span>
            </span>
            {free ? (
              <button
                type="button"
                onClick={() => download(f.type, f.url)}
                className="grid h-11 w-11 place-items-center rounded-full text-basil hover:bg-mint"
                aria-label={`Download ${f.label} (${f.type})`}
              >
                <IconDownload size={18} />
              </button>
            ) : (
              <IconLock size={18} className="mr-3 text-slate" aria-label="Unlocks after payment" />
            )}
          </li>
        ))}
      </ul>

      {free ? (
        <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => download(t.files.map((f) => f.type).join("+"), t.files[0]?.url)}>
          <IconDownload size={18} /> Download
        </button>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-primary mt-6 w-full"
            onClick={() => toast("Checkout opens here once payments are set up.")}
          >
            Get it for {formatPrice(t.price!)} <IconArrow size={18} className="btn-arrow" />
          </button>
          <p className="mt-3 text-sm text-slate">
            UPI and cards. Files arrive by email with a secure link. By continuing, you agree to the{" "}
            <Link href="/terms" className="font-medium text-basil underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/refund-policy" className="font-medium text-basil underline underline-offset-2">
              Refund Policy
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}
