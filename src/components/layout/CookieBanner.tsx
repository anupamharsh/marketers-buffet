"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { readConsent, saveConsent } from "@/lib/consent";

export const OPEN_COOKIES = "mb:cookies";

/**
 * Cookie banner: Accept all · Reject · Manage. Never blocks reading:
 * small card, no overlay, remembers the choice.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = readConsent();
    if (!c) {
      const t = window.setTimeout(() => setShow(true), 1800);
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

  useEffect(() => {
    if (show && ref.current) gsap.fromTo(ref.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 });
  }, [show]);

  const done = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    if (ref.current) gsap.to(ref.current, { y: 20, autoAlpha: 0, duration: 0.35, onComplete: () => setShow(false) });
    else setShow(false);
  };

  if (!show) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Cookie preferences"
      className="card fixed bottom-3 left-3 right-3 z-[130] max-w-[400px] !rounded-[22px] p-5 shadow-[var(--shadow-lift)] sm:bottom-5 sm:left-5 sm:right-auto"
    >
      <p className="font-semibold tracking-[-0.015em] text-ink">A quick one about cookies.</p>
      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate">
        They help me see which posts are useful. Nothing tracks you unless you say yes.{" "}
        <Link href="/cookie-policy" className="font-medium text-basil underline underline-offset-2">
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
            <button className="btn btn-sm px-3 font-medium text-ink underline underline-offset-4 hover:bg-ink/5" onClick={() => setManage(true)}>
              Manage
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={`flex min-h-11 items-center justify-between gap-4 rounded-2xl bg-paper px-4 py-2.5 ${disabled ? "opacity-70" : "cursor-pointer"}`}>
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-slate">{hint}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-basil ${
          checked ? "bg-basil" : "bg-[#cfccc5]"
        }`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </label>
  );
}
