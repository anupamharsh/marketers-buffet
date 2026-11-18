/**
 * Analytics events → GTM dataLayer. GTM forwards them to GA4 and Meta.
 * GTM itself is only injected after the visitor accepts cookies.
 */
export type MBEvent =
  | { event: "newsletter_signup"; location: string }
  | { event: "template_download"; template_name: string }
  | { event: "template_purchase"; template_name: string; price: number }
  | { event: "call_booking_start"; call_type: "free_intro" | "paid" }
  | { event: "post_read"; post_title: string; kind: string }
  | { event: "site_search"; search_term: string }
  | { event: "prompt_copy"; page: string }
  | { event: "share"; platform: string }
  | { event: "social_click"; platform: "instagram" | "linkedin" };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(payload: MBEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/** Keep UTM parameters for the session so signups and purchases stay attributed. */
export function persistUtms() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) found[k] = v.slice(0, 100);
  });
  if (Object.keys(found).length) sessionStorage.setItem("mb-utm", JSON.stringify(found));
}

export function getUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("mb-utm") || "{}");
  } catch {
    return {};
  }
}
