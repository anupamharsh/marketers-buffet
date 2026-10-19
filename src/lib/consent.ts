export type Consent = {
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the choice */
  at: string;
};

export const CONSENT_KEY = "mb-consent-v1";
export const CONSENT_EVENT = "mb:consent";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(c: Omit<Consent, "at">) {
  const value: Consent = { ...c, at: new Date().toISOString() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  applyConsent(value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  return value;
}

/** Google Consent Mode v2 update. Defaults (all denied) are set inline in <head>. */
export function applyConsent(c: Consent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

/** Inline script for <head>: runs before anything else. */
export const CONSENT_DEFAULTS_SCRIPT = `
document.documentElement.classList.add('js');
setTimeout(function(){if(!window.__mbReady)document.documentElement.classList.remove('js')},4000);
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(c){gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'});}}catch(e){}
`;
