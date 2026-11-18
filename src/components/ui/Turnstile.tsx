"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    __mbTurnstile?: Promise<void>;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function load() {
  if (window.turnstile) return Promise.resolve();
  if (!window.__mbTurnstile) {
    window.__mbTurnstile = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("turnstile"));
      document.head.appendChild(s);
    });
  }
  return window.__mbTurnstile;
}

export type TurnstileHandle = { token: () => string; reset: () => void };

/**
 * Cloudflare Turnstile (managed mode): invisible for most visitors, a checkbox
 * only when someone looks suspicious. Renders nothing if no site key is set.
 */
export const Turnstile = forwardRef<TurnstileHandle, { theme?: "light" | "dark" | "auto" }>(function Turnstile({ theme = "auto" }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const tok = useRef("");

  useImperativeHandle(ref, () => ({
    token: () => tok.current,
    reset: () => {
      tok.current = "";
      if (id.current) window.turnstile?.reset(id.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY || !box.current) return;
    let alive = true;
    load()
      .then(() => {
        if (!alive || !box.current || !window.turnstile) return;
        id.current = window.turnstile.render(box.current, {
          sitekey: SITE_KEY,
          theme,
          appearance: "interaction-only",
          callback: (t: string) => (tok.current = t),
          "expired-callback": () => (tok.current = ""),
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (id.current) window.turnstile?.remove(id.current);
    };
  }, [theme]);

  return <div ref={box} className="empty:hidden" />;
});
