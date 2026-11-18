"use client";
import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="shell pb-24 pt-32 md:pt-40">
      <p className="t-label mb-5">Error</p>
      <h1 className="t-h1 text-ink">
        Something broke <span className="tail block">on our end.</span>
      </h1>
      <p className="mt-6 max-w-md text-muted">Try again in a moment. If it keeps happening, email marketersbuffet@gmail.com.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
