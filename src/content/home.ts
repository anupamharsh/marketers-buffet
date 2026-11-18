import type { Cover } from "./types";

/**
 * Hero photo row (5 tiles). The owner will provide the photos: add each as
 * { image: { src: "/photos/hero-1.webp", alt: "…" } } and it replaces the pattern.
 */
export const heroPhotos: Cover[] = [
  { shape: "dots", tone: "lilac" },
  { shape: "lines", tone: "indigo" },
  { shape: "linecircle", tone: "lilac" },
  { shape: "circles", tone: "indigo" },
  { shape: "waves", tone: "lilac" },
];
