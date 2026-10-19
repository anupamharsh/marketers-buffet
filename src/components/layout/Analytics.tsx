"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";
import { persistUtms } from "@/lib/analytics";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Injects Google Tag Manager only after the visitor accepts analytics or
 * marketing cookies. GA4 + Meta Pixel are configured inside GTM, so new
 * tracking can be added without code changes.
 */
export function Analytics() {
  useEffect(() => {
    persistUtms();
    const load = (c: Consent | null) => {
      if (!GTM_ID || !c || (!c.analytics && !c.marketing)) return;
      if (document.getElementById("mb-gtm")) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const s = document.createElement("script");
      s.id = "mb-gtm";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
      document.head.appendChild(s);
    };
    load(readConsent());
    const on = (e: Event) => load((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, on);
    return () => window.removeEventListener(CONSENT_EVENT, on);
  }, []);

  return null;
}
