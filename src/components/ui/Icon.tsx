import { TABLER, type TablerName } from "./tabler";

/**
 * Thin line UI icons from the asset pack (tabler-icons, MIT).
 * One stroke weight everywhere (1.5), colour follows the text.
 */
export function Icon({ name, size = 18, className = "", label }: { name: TablerName; size?: number; className?: string; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: TABLER[name] }}
    />
  );
}

export type { TablerName };
