import type { ElementType, ReactNode } from "react";

/**
 * Two-tone section headline with a small numbered label above.
 * The tail fades to grey on light, lilac on dark (via the .tail token).
 */
export function Heading({
  num,
  label,
  lead,
  tail,
  as: Tag = "h2",
  size = "display",
  id,
  className = "",
  children,
}: {
  num?: string;
  label?: string;
  lead: ReactNode;
  tail?: ReactNode;
  as?: ElementType;
  size?: "hero" | "display" | "h1";
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  const cls = size === "hero" ? "t-hero" : size === "h1" ? "t-h1" : "t-display";
  return (
    <div className={className}>
      {label ? (
        <p className="t-label mb-5">
          {num ? `${num} — ` : ""}
          {label}
        </p>
      ) : null}
      <Tag id={id} className={`${cls} text-ink`}>
        {lead}
        {tail ? (
          <>
            {" "}
            <span className="tail block">{tail}</span>
          </>
        ) : null}
      </Tag>
      {children}
    </div>
  );
}
