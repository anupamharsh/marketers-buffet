import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  /** Any CSS colour. Defaults to the current text colour. */
  color?: string;
  /** Colour of the highlight curve (usually the background behind the logo). null removes it. */
  highlight?: string | null;
  title?: string;
};

/**
 * The original Marketers Buffet cloche (geometry identical to the logo pack),
 * recoloured to the site palette. Never redraw it; only change the fill.
 */
export function Cloche({ color = "currentColor", highlight = null, title, ...rest }: Props) {
  return (
    <svg viewBox="40 80 320 290" fill="none" xmlns="http://www.w3.org/2000/svg" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...rest}>
      {title ? <title>{title}</title> : null}
      <g style={{ fill: color }}>
        <path d="M180 118 A20 20 0 1 0 220 118 A20 20 0 1 0 180 118 Z" />
        <path d="M189 118 H211 V148 H189 Z" />
        <path d="M70 268 A130 130 0 0 1 330 268 Z" />
        <path d="M68 256 H332 A22 22 0 0 1 332 300 H68 A22 22 0 0 1 68 256 Z" />
        <path d="M96 292 H160 L84 350 C73 358 61 352 65 339 Z" />
      </g>
      {highlight ? <path d="M116 229 A92 92 0 0 1 161 185" style={{ stroke: highlight }} strokeWidth="16" strokeLinecap="round" /> : null}
    </svg>
  );
}

export function Logo({ className = "", highlight = null }: { className?: string; highlight?: string | null }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-[-0.02em] ${className}`}>
      <Cloche highlight={highlight} className="h-[1.45em] w-auto shrink-0" />
      <span className="whitespace-nowrap">Marketers Buffet</span>
    </span>
  );
}
