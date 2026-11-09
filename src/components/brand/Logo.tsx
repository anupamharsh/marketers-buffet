import { Cloche } from "./Cloche";

type Props = {
  /** primary follows the theme (basil on light, cream on dark); cream and ink are fixed. */
  tone?: "primary" | "cream" | "ink";
  className?: string;
  /** Hide the wordmark (icon only) */
  iconOnly?: boolean;
};

/** Horizontal lockup: cloche + "Marketers" (Inter Bold, -2%) + "Buffet" (Instrument Serif Italic). */
export function Logo({ tone = "primary", className = "", iconOnly = false }: Props) {
  const icon = tone === "cream" ? "#F8F7F4" : tone === "ink" ? "#141414" : undefined;
  // Single-colour versions knock the highlight out (brand book, Logo).
  const hi = tone === "primary" ? undefined : null;
  const text = tone === "cream" ? "text-cream" : tone === "ink" ? "text-[#141414]" : "text-ink";
  const accent = tone === "cream" ? "text-cream" : tone === "ink" ? "text-[#141414]" : "text-accent";
  return (
    <span className={`inline-flex items-center gap-[0.55em] ${className}`}>
      <Cloche color={icon} highlight={hi} className="h-[1.6em] w-auto shrink-0" />
      {iconOnly ? null : (
        <span className={`whitespace-nowrap font-bold tracking-[-0.03em] ${text}`} style={{ lineHeight: 1 }}>
          Marketers{" "}
          <span className={`font-serif text-[1.12em] font-normal italic tracking-[-0.01em] ${accent}`}>Buffet</span>
        </span>
      )}
    </span>
  );
}
