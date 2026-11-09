"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { applyTheme, currentTheme, savedTheme, THEME_KEY, type Theme } from "@/lib/theme";

/**
 * Light / dark switch. The new theme spreads out from the button as a circle
 * (View Transitions API); browsers without it, or visitors who prefer reduced
 * motion, get an instant switch.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTheme(currentTheme());
    // Follow the OS setting until the visitor makes their own choice.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (savedTheme()) return;
      const next: Theme = e.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const commit = () => {
      applyTheme(next);
      setTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      commit();
      return;
    }

    const r = btn.current!.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => flushSync(commit));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 720, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  };

  const dark = theme === "dark";

  return (
    <button
      ref={btn}
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative grid h-11 w-11 place-items-center overflow-hidden rounded-full text-ink transition-colors hover:bg-ink/5 ${className}`}
    >
      {/* Sun */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden
        className={`absolute transition-all duration-500 ease-[var(--ease-out-soft)] ${dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
      {/* Moon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={`absolute transition-all duration-500 ease-[var(--ease-out-soft)] ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
      >
        <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" />
      </svg>
    </button>
  );
}
