"use client";

import { useEffect, useState } from "react";
import { applyTheme, currentTheme, savedTheme, THEME_KEY, type Theme } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

/** Dark-mode toggle. Remembers the choice; follows the OS until one is made. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(currentTheme());
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

  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={`icon-btn ${className}`}
      aria-pressed={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const next: Theme = dark ? "light" : "dark";
        applyTheme(next);
        setTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {}
      }}
    >
      <Icon name={dark ? "sun" : "moon"} size={17} />
    </button>
  );
}
