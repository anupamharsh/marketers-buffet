"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { track, getUtms } from "@/lib/analytics";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { Icon } from "@/components/ui/Icon";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter signup. "pill" = email field and button in one capsule (homepage
 * and newsletter page); "compact" = small footer version on inner pages.
 */
export function NewsletterForm({ location, variant = "pill", success = "You're in. See you in your inbox soon." }: { location: string; variant?: "pill" | "compact"; success?: string }) {
  const id = useId();
  const ts = useRef<TurnstileHandle>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setErr("That email doesn't look right. Check for typos?");
      return;
    }
    setState("loading");
    setErr(null);
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), location, utm: getUtms(), token: ts.current?.token() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.message || "Something broke on our end. Try again in a moment.");
      setState("done");
      track({ event: "newsletter_signup", location });
    } catch (x) {
      setState("idle");
      setErr((x as Error).message);
      ts.current?.reset();
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="flex items-center gap-2.5 font-semibold text-ink">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-lilac text-indigo">
          <Icon name="check" size={15} />
        </span>
        {success}
      </p>
    );
  }

  const pill = variant === "pill";
  return (
    <form onSubmit={submit} noValidate className="w-full">
      <label htmlFor={`${id}-e`} className="sr-only">
        Email address
      </label>
      <div className={pill ? "flex items-center gap-1 rounded-full border border-line bg-white/5 p-1.5 pl-5" : "flex gap-2"}>
        <input
          id={`${id}-e`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErr(null);
          }}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
          className={pill ? "min-h-11 min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted" : "field !min-h-11 flex-1 rounded-full"}
        />
        <button type="submit" disabled={state === "loading"} className={`btn ${pill ? "btn-lilac" : "btn-primary"} shrink-0`}>
          {state === "loading" ? "Sending…" : "Count me in"}
        </button>
      </div>
      <Turnstile ref={ts} />
      {err ? (
        <p id={`${id}-err`} role="alert" className="mt-2 text-sm font-medium text-danger">
          {err}
        </p>
      ) : null}
    </form>
  );
}
