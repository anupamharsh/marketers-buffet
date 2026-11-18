"use client";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { authConfigured, supabase } from "@/lib/supabase-browser";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Only allow same-site paths as the return address. */
function safeNext(v: string | null) {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/account";
}

/** Sign in with Google or a one-time email code. No passwords. */
export function SignIn() {
  const id = useId();
  const router = useRouter();
  const { session, ready } = useAuth();
  const [next, setNext] = useState("/account");
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setNext(safeNext(p.get("next")));
    const e = p.get("error_description");
    if (e) setErr(e.slice(0, 200));
  }, []);

  useEffect(() => {
    if (ready && session) router.replace(next);
  }, [ready, session, next, router]);

  if (!authConfigured()) {
    return <p className="rounded-[18px] border border-line bg-surface p-5 text-muted">Sign-in isn&apos;t switched on yet. Check back soon.</p>;
  }

  async function google() {
    setErr(null);
    setBusy(true);
    const { error } = await supabase()!.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/signin?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setErr("Google sign-in didn't start. Try again, or use an email code.");
      setBusy(false);
    }
  }

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return setErr("That email doesn't look right. Check for typos?");
    setBusy(true);
    setErr(null);
    const { error } = await supabase()!.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) {
      setErr(/rate|limit|seconds/i.test(error.message) ? "Too many codes asked for. Wait a minute and try again." : "We couldn't send the code. Try again in a moment.");
      return;
    }
    setStep("code");
    setInfo(`We sent a code to ${email.trim()}. It works for one hour.`);
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    const token = code.replace(/\s/g, "");
    if (!/^\d{6,10}$/.test(token)) return setErr("Enter the code from the email (numbers only).");
    setBusy(true);
    setErr(null);
    const { error } = await supabase()!.auth.verifyOtp({ email: email.trim(), token, type: "email" });
    setBusy(false);
    if (error) setErr("That code didn't work. Check it, or ask for a new one.");
  }

  return (
    <div className="grid gap-6">
      <button type="button" onClick={google} disabled={busy} className="btn btn-ghost min-h-12 w-full gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/tools/google.svg" alt="" width={18} height={18} className="dark:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/tools/google-light.svg" alt="" width={18} height={18} className="hidden dark:block" />
        Continue with Google
      </button>
      <div className="flex items-center gap-3 text-sm text-muted" aria-hidden>
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      {step === "email" ? (
        <form onSubmit={sendCode} noValidate className="grid gap-3">
          <label htmlFor={`${id}-e`} className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id={`${id}-e`}
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(null);
            }}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Sending…" : "Email me a code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} noValidate className="grid gap-3">
          {info ? (
            <p role="status" className="text-sm text-muted">
              {info}
            </p>
          ) : null}
          <label htmlFor={`${id}-c`} className="text-sm font-medium text-ink">
            One-time code
          </label>
          <input
            id={`${id}-c`}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="field text-center text-xl tracking-[0.4em]"
            maxLength={12}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErr(null);
            }}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Checking…" : "Sign in"}
          </button>
          <button
            type="button"
            className="btn btn-sm mx-auto text-muted underline underline-offset-4"
            onClick={() => {
              setStep("email");
              setCode("");
              setInfo(null);
            }}
          >
            Use a different email
          </button>
        </form>
      )}
      {err ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {err}
        </p>
      ) : null}
    </div>
  );
}
