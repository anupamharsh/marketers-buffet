import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
  highlight?: string | null;
  /** Show the three "typing" dots on the dome (for animation) */
  dots?: boolean;
  title?: string;
};

/**
 * The Marketers Buffet cloche, rebuilt from the logo pack SVG with each part
 * on its own group so it can be animated:
 *   .mb-lid   knob + stem + dome + highlight (lifts open)
 *   .mb-plate rim + speech-bubble tail (stays)
 *   .mb-dot   three typing dots on the dome
 * Geometry is identical to public/brand/icon-primary.svg.
 */
export function Cloche({ color = "#1E4D3E", highlight = "#F8F7F4", dots = false, title, ...rest }: Props) {
  return (
    <svg
      viewBox="40 80 320 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      overflow="visible"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <g className="mb-plate" fill={color}>
        <path d="M68 256 H332 A22 22 0 0 1 332 300 H68 A22 22 0 0 1 68 256 Z" />
        <path d="M96 292 H160 L84 350 C73 358 61 352 65 339 Z" />
      </g>
      <g className="mb-lid">
        <g fill={color}>
          <path d="M180 118 A20 20 0 1 0 220 118 A20 20 0 1 0 180 118 Z" />
          <path d="M189 118 H211 V148 H189 Z" />
          <path d="M70 268 A130 130 0 0 1 330 268 Z" />
        </g>
        {highlight ? (
          <path
            className="mb-highlight"
            d="M116 229 A92 92 0 0 1 161 185"
            stroke={highlight}
            strokeWidth="16"
            strokeLinecap="round"
          />
        ) : null}
        {dots ? (
          <g fill={highlight || "#F8F7F4"}>
            <circle className="mb-dot" cx="164" cy="226" r="11" opacity="0" />
            <circle className="mb-dot" cx="200" cy="226" r="11" opacity="0" />
            <circle className="mb-dot" cx="236" cy="226" r="11" opacity="0" />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
