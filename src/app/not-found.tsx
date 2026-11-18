import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/ui/Cover";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="shell grid gap-12 pb-24 pt-32 md:pt-40 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div>
        <p className="t-label mb-5">404</p>
        <h1 className="t-display text-ink">
          Page not <span className="tail block">found.</span>
        </h1>
        <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-muted">That page doesn&apos;t exist, or it moved. Try one of these instead.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/blog" className="btn btn-ghost">
            Blog
          </Link>
          <Link href="/templates" className="btn btn-ghost">
            Templates
          </Link>
        </div>
      </div>
      <Cover cover={{ shape: "linecircle", tone: "indigo" }} className="aspect-square rounded-[28px]" />
    </div>
  );
}
