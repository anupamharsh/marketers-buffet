import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { IconArrow } from "./Icons";

export function SectionHead({
  label,
  title,
  line,
  action,
  id,
  as = "h2",
  className = "",
}: {
  label?: string;
  title: string;
  line?: string;
  action?: { href: string; label: string };
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-3xl">
        {label ? (
          <Reveal>
            <p className="mb-5 flex items-center gap-2.5 text-sm font-medium text-slate">
              <span className="h-px w-8 bg-ink/30" aria-hidden />
              {label}
            </p>
          </Reveal>
        ) : null}
        <RevealText as={as} id={id} text={title} className={as === "h1" ? "t-h1" : "t-h2"} />
        {line ? (
          <Reveal delay={0.15}>
            <p className="t-lead mt-5 max-w-xl">{line}</p>
          </Reveal>
        ) : null}
      </div>
      {action ? (
        <Reveal delay={0.2} className="shrink-0">
          <Link href={action.href} className="btn btn-ghost">
            {action.label} <IconArrow size={18} className="btn-arrow" />
          </Link>
        </Reveal>
      ) : null}
    </div>
  );
}
