"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, saveConsent } from "@/lib/consent";

export const OPEN_COOKIES = "mb:cookies";

/** Accept all · Reject · Manage. Small card, never blocks reading. */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (!c) {
      const t = window.setTimeout(() => setShow(true), 1500);
      return () => window.clearTimeout(t);
    }
    setAnalytics(c.analytics);
    setMarketing(c.marketing);
  }, []);

  useEffect(() => {
    const open = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setManage(true);
      setShow(true);
    };
    window.addEventListener(OPEN_COOKIES, open);
    return () => window.removeEventListener(OPEN_COOKIES, open);
  }, []);

  const done = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setShow(false);
    setManage(false);
  };

  if (!show) return null;

  return (
    <div role="region" aria-label="Cookie preferences" className="fixed bottom-3 left-3 right-3 z-[130] max-w-[390px] rounded-[22px] border border-line bg-surface p-5 shadow-2xl sm:bottom-5 sm:left-5 sm:right-auto">
      <p className="font-semibold text-ink">A quick one about cookies.</p>
      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">
        They show which pages are useful. Nothing tracks you unless you say yes.{" "}
        <Link href="/cookies" className="font-medium text-ink underline underline-offset-2">
          Cookie policy
        </Link>
      </p>
      {manage ? (
        <fieldset className="mt-4 grid gap-2">
          <legend className="sr-only">Choose cookie types</legend>
          <Toggle label="Essential" hint="Keeps the site working. Always on." checked disabled />
          <Toggle label="Analytics" hint="Google Analytics, to see what's read." checked={analytics} onChange={setAnalytics} />
          <Toggle label="Marketing" hint="Meta Pixel, to measure campaigns." checked={marketing} onChange={setMarketing} />
        </fieldset>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {manage ? (
          <button className="btn btn-primary btn-sm flex-1" onClick={() => done(analytics, marketing)}>
            Save choices
          </button>
        ) : (
          <>
            <button className="btn btn-primary btn-sm flex-1" onClick={() => done(true, true)}>
              Accept all
            </button>
            <button className="btn btn-ghost btn-sm flex-1" onClick={() => done(false, false)}>
              Reject
            </button>
            <button className="btn btn-sm px-3 text-ink underline underline-offset-4" onClick={() => setManage(true)}>
              Manage
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, hint, checked, disabled, onChange }: { label: string; hint: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className={`flex min-h-11 items-center justify-between gap-4 rounded-2xl border border-line px-4 py-2.5 ${disabled ? "opacity-70" : "cursor-pointer"}`}>
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} className="peer sr-only" />
      <span aria-hidden className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-[160ms] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${checked ? "bg-indigo dark:bg-lilac" : "bg-ink/20"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white ${checked ? "left-6" : "left-1"}`} />
      </span>
    </label>
  );
}
