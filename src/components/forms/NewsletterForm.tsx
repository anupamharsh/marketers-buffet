"use client";

import { useId, useState, type FormEvent } from "react";
import { track, getUtms } from "@/lib/analytics";
import { IconArrow, IconCheck } from "@/components/ui/Icons";

type Location = "hero" | "footer" | "post" | "newsletter_page" | "home";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({
  location,
  button = "Send it my way",
  dark = false,
  compact = false,
  smallPrint,
}: {
  location: Location;
  button?: string;
  dark?: boolean;
  compact?: boolean;
  smallPrint?: string | null;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("That email doesn't look quite right. Check for typos?");
      setState("error");
      return;
    }
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), location, utm: getUtms() }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      track({ event: "newsletter_signup", location });
    } catch {
      setState("error");
      setError("Something broke on our end. Try again in a moment.");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className={`flex items-center gap-3 text-lg font-semibold tracking-[-0.02em] ${dark ? "text-cream" : "text-ink"}`}>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-basil text-cream">
          <IconCheck size={18} />
        </span>
        You&apos;re in. First issue lands soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`w-full ${dark ? "on-dark" : ""}`}>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className={`flex w-full gap-2 ${compact ? "flex-row" : "flex-col sm:flex-row"}`}>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error" ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="field flex-1 rounded-full px-5"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={`btn ${dark ? "btn-cream" : "btn-primary"} ${compact ? "aspect-square !px-0 sm:aspect-auto sm:!px-6" : ""}`}
          aria-label={compact ? button : undefined}
        >
          <span className={compact ? "hidden sm:inline" : ""}>{state === "loading" ? "Sending…" : button}</span>
          <IconArrow size={18} className="btn-arrow" />
        </button>
      </div>
      {error ? (
        <p id={`${id}-err`} role="alert" className={`mt-2 text-sm font-medium ${dark ? "text-peach" : "text-[#8f2d1f]"}`}>
          {error}
        </p>
      ) : smallPrint !== null ? (
        <p className={`mt-3 text-sm ${dark ? "text-muted-cream" : "text-slate"}`}>
          {smallPrint ?? "Every two weeks. Unsubscribe in one click, no hard feelings."}
        </p>
      ) : null}
    </form>
  );
}
