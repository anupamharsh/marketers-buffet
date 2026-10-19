"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import { IconArrow, IconCheck, IconClock } from "@/components/ui/Icons";

type CallType = "free_intro" | "paid";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"];

/**
 * Booking flow: intake form → pick a time → confirmed.
 * TODO(booking): replace step 2 with the chosen booking tool's embed (e.g.
 * Cal.com, styled to the brand) running on the brand email; paid sessions are
 * charged at booking through the payment gateway. Slots below are placeholders.
 */
export function BookingWidget() {
  const id = useId();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<CallType>("free_intro");
  const [form, setForm] = useState({ name: "", email: "", topic: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [tz, setTz] = useState("your timezone");
  const panel = useRef<HTMLDivElement>(null);

  // Dates are computed after mount so server and client markup match.
  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "your timezone");
    const out: Date[] = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
    }
    setDays(out);
  }, []);

  useEffect(() => {
    if (panel.current && step > 1) {
      gsap.fromTo(panel.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 });
      panel.current.querySelector<HTMLElement>("h3")?.focus();
    }
  }, [step]);

  // Placeholder availability: hide a couple of slots per day so it feels real.
  const taken = useMemo(() => new Set(days.flatMap((d, i) => [`${i}-${(d.getDate() + 1) % 6}`, `${i}-${(d.getDate() * 3) % 6}`])), [days]);

  function next(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Add your name so I know who I'm talking to.";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "That email doesn't look quite right.";
    if (form.topic.trim().length < 5) errs.topic = "A line or two is plenty. What's on your mind?";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`${id}-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    track({ event: "call_booking_start", page: "book_a_call" });
    setStep(2);
  }

  function confirm() {
    if (!time) return;
    track({ event: "call_booked", call_type: type });
    setStep(3);
  }

  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-IN", o);

  return (
    <div className="card overflow-hidden !rounded-[28px]">
      <ol className="flex border-b border-line text-sm font-medium" aria-label="Booking steps">
        {["About you", "Pick a time", "Done"].map((s, i) => (
          <li
            key={s}
            aria-current={step === i + 1 ? "step" : undefined}
            className={`flex flex-1 items-center gap-2 px-5 py-4 ${step === i + 1 ? "text-ink" : "text-slate"} ${i ? "border-l border-line" : ""}`}
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${step > i + 1 ? "bg-basil text-cream" : step === i + 1 ? "bg-ink text-cream" : "bg-line text-slate"}`}>
              {step > i + 1 ? <IconCheck size={13} /> : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </li>
        ))}
      </ol>

      <div ref={panel} className="p-6 md:p-10">
        {step === 1 ? (
          <form onSubmit={next} noValidate className="grid gap-5">
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-ink">Type of call</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { v: "free_intro", t: "Intro call", d: "30 minutes · Free" },
                    { v: "paid", t: "Working session", d: "₹99 per hour · paid at booking" },
                  ] as const
                ).map((o) => (
                  <label
                    key={o.v}
                    className={`flex min-h-[72px] cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-basil ${
                      type === o.v ? "border-basil bg-mint/60" : "border-line bg-white hover:border-ink/25"
                    }`}
                  >
                    <input type="radio" name="type" value={o.v} checked={type === o.v} onChange={() => setType(o.v)} className="sr-only" />
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${type === o.v ? "border-basil" : "border-[#bdb9b1]"}`} aria-hidden>
                      {type === o.v ? <span className="h-2.5 w-2.5 rounded-full bg-basil" /> : null}
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">{o.t}</span>
                      <span className="block text-sm text-slate">{o.d}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${id}-name`} label="Your name" error={errors.name}>
                <input id={`${id}-name`} className="field" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
              </Field>
              <Field id={`${id}-email`} label="Email" error={errors.email}>
                <input id={`${id}-email`} type="email" inputMode="email" className="field" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? `${id}-email-err` : undefined} />
              </Field>
            </div>
            <Field id={`${id}-topic`} label="What do you want to talk about?" error={errors.topic}>
              <textarea id={`${id}-topic`} className="field" maxLength={1200} placeholder="A campaign that's stuck, an idea that needs shape, or a gig…" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} aria-invalid={errors.topic ? true : undefined} aria-describedby={errors.topic ? `${id}-topic-err` : undefined} />
            </Field>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm text-slate">
                By continuing, you agree to the{" "}
                <Link href="/terms" className="font-medium text-basil underline underline-offset-2">Terms</Link> and{" "}
                <Link href="/refund-policy" className="font-medium text-basil underline underline-offset-2">Refund Policy</Link>.
              </p>
              <button type="submit" className="btn btn-primary">
                Pick a time <IconArrow size={18} className="btn-arrow" />
              </button>
            </div>
          </form>
        ) : null}

        {step === 2 ? (
          <div>
            <h3 tabIndex={-1} className="text-2xl font-bold tracking-[-0.035em] text-ink outline-none">
              {type === "free_intro" ? "Intro call · 30 min" : "Working session · 60 min"}
            </h3>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate">
              <IconClock size={15} /> Times shown in {tz}. Video link sent by email.
            </p>
            <div className="no-scrollbar -mx-1 mt-7 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Choose a day">
              {days.map((d, i) => (
                <button
                  key={d.toISOString()}
                  type="button"
                  aria-pressed={day === i}
                  onClick={() => {
                    setDay(i);
                    setTime(null);
                  }}
                  className={`flex min-w-[72px] shrink-0 flex-col items-center rounded-2xl border px-3 py-3 transition-colors ${day === i ? "border-ink bg-ink text-cream" : "border-line bg-white text-ink hover:border-ink/30"}`}
                >
                  <span className="text-xs font-medium opacity-80">{fmt(d, { weekday: "short" })}</span>
                  <span className="text-xl font-bold tracking-[-0.03em]">{d.getDate()}</span>
                  <span className="text-xs opacity-80">{fmt(d, { month: "short" })}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Choose a time">
              {TIMES.map((t, j) => {
                const off = taken.has(`${day}-${j}`);
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={off}
                    aria-pressed={time === t}
                    onClick={() => setTime(t)}
                    className={`min-h-12 rounded-xl border text-[0.95rem] font-semibold transition-colors ${
                      off ? "cursor-not-allowed border-line bg-paper text-[#77736c] line-through" : time === t ? "border-basil bg-basil text-cream" : "border-line bg-white text-ink hover:border-basil"
                    }`}
                  >
                    {t}
                    <span className="sr-only">{off ? " (unavailable)" : ""}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="button" className="btn btn-primary" disabled={!time} onClick={confirm}>
                {type === "paid" ? "Pay ₹99 and book" : "Confirm booking"} <IconArrow size={18} className="btn-arrow" />
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="py-6 text-center" role="status">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-basil text-cream">
              <IconCheck size={30} />
            </span>
            <h3 tabIndex={-1} className="mt-6 text-[clamp(1.75rem,3vw,2.4rem)] font-bold tracking-[-0.04em] text-ink outline-none">
              Booked! <span className="serif serif-basil">See you there.</span>
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-slate">You&apos;ll get a confirmation email shortly{days[day] && time ? ` for ${fmt(days[day], { weekday: "long", day: "numeric", month: "long" })} at ${time}` : ""}.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-[#8f2d1f]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
