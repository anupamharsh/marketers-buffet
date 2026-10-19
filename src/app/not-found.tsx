import Link from "next/link";
import { Cloche } from "@/components/brand/Cloche";
import { Glows } from "@/components/ui/Art";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden px-5 pb-20 pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Glows glow="both" />
      </div>
      <div className="tex-dots pointer-events-none absolute inset-0 -z-10" />
      <div className="text-center">
        {/* The lid is lifted and the plate is empty. */}
        <div className="mx-auto w-40 [&_.mb-lid]:[transform-box:fill-box] [&_.mb-lid]:origin-[90%_100%] [&_.mb-lid]:-translate-y-6 [&_.mb-lid]:-rotate-[18deg]">
          <Cloche className="h-auto w-full overflow-visible" />
        </div>
        <p className="t-num mt-10 text-[clamp(5rem,14vw,10rem)]">404</p>
        <h1 className="t-h2 mt-2 text-ink">
          This page <span className="serif serif-basil">wandered off.</span>
        </h1>
        <p className="t-lead mt-4">Let&apos;s get you back.</p>
        <Link href="/" className="btn btn-primary mt-9">
          Go home
        </Link>
      </div>
    </section>
  );
}
