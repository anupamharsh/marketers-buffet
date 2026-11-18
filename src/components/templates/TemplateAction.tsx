"use client";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";

type Link_ = { label: string; url: string };

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void };
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Couldn't load the payment window. Check your connection and try again."));
    document.body.appendChild(s);
  });
}

/**
 * Free: "Download" asks for an email first (skipped when signed in) and adds
 * it to the newsletter list. Paid: "Buy now" opens Razorpay Checkout; the
 * server creates the order, verifies the payment and returns the files.
 */
export function TemplateAction({ slug, name, price }: { slug: string; name: string; price: number | null }) {
  const id = useId();
  const { session, api } = useAuth();
  const ts = useRef<TurnstileHandle>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [links, setLinks] = useState<Link_[] | null>(null);
  const free = price === null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!session && !EMAIL_RE.test(email.trim())) return setErr("That email doesn't look right. Check for typos?");
    setBusy(true);
    try {
      if (free) await download();
      else await buy();
    } catch (x) {
      setErr((x as Error).message);
      ts.current?.reset();
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    const r = await api("/api/templates/download", { method: "POST", body: JSON.stringify({ slug, email: email.trim(), token: ts.current?.token() }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.message || "Something broke on our end. Try again in a moment.");
    setLinks(d.links);
    track({ event: "template_download", template_name: name });
    if (d.links?.[0]) window.location.assign(d.links[0].url);
  }

  async function buy() {
    const [, r] = await Promise.all([
      loadRazorpay(),
      api("/api/checkout/order", { method: "POST", body: JSON.stringify({ slug, email: email.trim(), token: ts.current?.token() }) }),
    ]);
    const o = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(o.message || "Something broke on our end. Try again in a moment.");
    await new Promise<void>((resolve, reject) => {
      const rzp = new window.Razorpay!({
        key: o.keyId,
        order_id: o.orderId,
        amount: o.amount,
        currency: o.currency,
        name: "Marketers Buffet",
        description: o.name,
        prefill: { email: o.email },
        theme: { color: "#1A0B4B" },
        modal: { ondismiss: () => reject(new Error("Payment cancelled. Nothing was charged.")) },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const v = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature }),
            });
            const d = await v.json().catch(() => ({}));
            if (!v.ok) throw new Error(d.message || "We couldn't confirm that payment. If money left your account, email us.");
            setLinks(d.links);
            track({ event: "template_purchase", template_name: name, price: price ?? 0 });
            resolve();
          } catch (x) {
            reject(x);
          }
        },
      });
      rzp.on("payment.failed", () => reject(new Error("The payment didn't go through. Nothing was charged. Try again or use another method.")));
      rzp.open();
    });
  }

  if (links) {
    return (
      <div role="status" className="rounded-[22px] border border-line bg-surface p-5">
        <p className="flex items-center gap-2.5 font-semibold text-ink">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-lilac text-indigo">
            <Icon name="check" size={15} />
          </span>
          {free ? "Your download has started." : "Paid. It's yours."}
        </p>
        <ul className="mt-4 grid gap-2">
          {links.map((l) => (
            <li key={l.url}>
              <a href={l.url} className="btn btn-ghost w-full justify-between">
                {l.label} <Icon name="arrow-right" size={16} />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          {session ? (
            <>
              These links expire soon. Download again any time from{" "}
              <Link href={free ? "/account?tab=downloads" : "/account?tab=purchases"} className="underline underline-offset-2">
                your account
              </Link>
              .
            </>
          ) : (
            <>
              These links expire soon. To download again later,{" "}
              <Link href="/signin?next=/account" className="underline underline-offset-2">
                sign in
              </Link>{" "}
              with the same email.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-3">
      {!session ? (
        <>
          <label htmlFor={`${id}-e`} className="text-sm font-medium text-ink">
            {free ? "Your email" : "Email for your receipt"}
          </label>
          <input
            id={`${id}-e`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="field"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(null);
            }}
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? `${id}-err` : undefined}
          />
        </>
      ) : null}
      <Turnstile ref={ts} />
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? (free ? "Preparing…" : "Opening checkout…") : free ? "Download" : "Buy now"}
      </button>
      {err ? (
        <p id={`${id}-err`} role="alert" className="text-sm font-medium text-danger">
          {err}
        </p>
      ) : null}
      <p className="text-xs text-muted">
        {free ? (
          <>You&apos;ll also get the fortnightly newsletter. Unsubscribe in one click.</>
        ) : (
          <>
            Secure payment by Razorpay (UPI, cards, netbanking).{" "}
            <Link href="/refunds" className="underline underline-offset-2">
              No refunds on digital downloads
            </Link>
            .
          </>
        )}
      </p>
    </form>
  );
}
