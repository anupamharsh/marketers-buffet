"use client";

import { ClocheLoader } from "@/components/brand/ClocheLoader";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="grid min-h-[80svh] place-items-center px-5 pt-28 text-center">
      <div>
        <ClocheLoader label="Error" />
        <h1 className="t-h2 mt-8 text-ink">
          Something <span className="serif serif-basil">broke</span> on our end.
        </h1>
        <p className="t-lead mt-4">Try again in a moment.</p>
        <button type="button" onClick={reset} className="btn btn-primary mt-8">
          Try again
        </button>
      </div>
    </section>
  );
}
