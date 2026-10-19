import { Cloche } from "./Cloche";

type Props = {
  tone?: "primary" | "cream" | "ink";
  className?: string;
  /** Hide the wordmark (icon only) */
  iconOnly?: boolean;
};

/** Horizontal lockup: cloche + "Marketers" (Inter Bold, -2%) + "Buffet" (Instrument Serif Italic). */
export function Logo({ tone = "primary", className = "", iconOnly = false }: Props) {
  const icon = tone === "cream" ? "#F8F7F4" : "#1E4D3E";
  const hi = tone === "cream" ? null : "#F8F7F4";
  const text = tone === "cream" ? "text-cream" : "text-ink";
  const accent = tone === "cream" ? "text-cream" : tone === "ink" ? "text-ink" : "text-basil";
  return (
    <span className={`inline-flex items-center gap-[0.55em] ${className}`}>
      <Cloche color={tone === "ink" ? "#141414" : icon} highlight={hi} className="h-[1.6em] w-auto shrink-0" />
      {iconOnly ? null : (
        <span className={`whitespace-nowrap font-bold tracking-[-0.03em] ${text}`} style={{ lineHeight: 1 }}>
          Marketers{" "}
          <span className={`font-serif text-[1.12em] font-normal italic tracking-[-0.01em] ${accent}`}>Buffet</span>
        </span>
      )}
    </span>
  );
}
