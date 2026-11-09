export type Theme = "light" | "dark";

export const THEME_KEY = "mb-theme";

/**
 * Inline script for <head>: sets the theme class before first paint so there
 * is no flash. A saved choice wins; otherwise follow the operating system.
 */
export const THEME_SCRIPT = `
try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}
`;

export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function savedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
}

/** Apply a theme with colour transitions suppressed, so every element flips in the same frame. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.classList.toggle("dark", theme === "dark");
  // Force a style flush, then re-enable transitions on the next frame.
  void root.offsetHeight;
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
}
