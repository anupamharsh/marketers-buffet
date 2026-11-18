import type { ReactNode } from "react";
import { Heading } from "./Heading";

/** Top of every inner page: room for the capsule navbar, two-tone h1, intro copy. */
export function PageIntro({ label, lead, tail, children, aside }: { label: string; lead: ReactNode; tail?: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="shell pb-12 pt-32 md:pb-16 md:pt-40">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <Heading as="h1" label={label} lead={lead} tail={tail} />
        {children ? <div className="max-w-md text-[1.05rem] leading-relaxed text-muted">{children}</div> : null}
      </div>
      {aside}
    </header>
  );
}
