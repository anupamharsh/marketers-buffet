"use client";
import { OPEN_COOKIES } from "@/components/layout/CookieBanner";

export function CookieSettingsButton() {
  return (
    <button type="button" className="btn btn-primary" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIES))}>
      Cookie settings
    </button>
  );
}
