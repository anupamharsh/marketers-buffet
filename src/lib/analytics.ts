/**
 * Analytics events from the website brief.
 * Everything goes to the GTM dataLayer. GTM forwards them to GA4 (key events)
 * and Meta (Lead / Purchase / Schedule). Nothing is sent until consent is given,
 * because GTM itself is only injected after the visitor accepts cookies.
 */
export type MBEvent =
  | { event: "newsletter_signup"; location: "hero" | "footer" | "post" | "newsletter_page" | "home" }
  | { event: "template_download"; template_name: string; file_type: string }
  | { event: "template_purchase"; template_name: string; price: number }
  | { event: "call_booking_start"; page: string }
  | { event: "call_booked"; call_type: "free_intro" | "paid" }
  | { event: "post_read"; post_title: string; format: string }
  | { event: "site_search"; search_term: string }
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

/** Keep UTM parameters on internal navigation so campaign traffic stays attributed. */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function persistUtms() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) found[k] = v;
  });
  if (Object.keys(found).length) {
    sessionStorage.setItem("mb-utm", JSON.stringify(found));
  }
}

export function getUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("mb-utm") || "{}");
  } catch {
    return {};
  }
}
