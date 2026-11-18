"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";

const INTRO = process.env.NEXT_PUBLIC_CAL_INTRO_URL || "";
const PAID = process.env.NEXT_PUBLIC_CAL_PAID_URL || "";

type Kind = "intro" | "paid";

/** Cal ID is built on Cal.com, so its booking pages accept Cal.com's inline embed URL. */
function embedUrl(url: string, dark: boolean) {
  const u = new URL(url.replace(/\/$/, "") + "/embed");
  u.searchParams.set("embed", "");
  u.searchParams.set("embedType", "inline");
  u.searchParams.set("layout", "month_view");
  u.searchParams.set("theme", dark ? "dark" : "light");
  return u.toString();
}

/**
 * Booking: free 30-minute intro call, or the paid ₹99 session (paid inside
 * Cal ID through its Razorpay app). The calendar is Cal ID's own page in an
 * iframe; a new-tab link is always there in case the embed is blocked.
 */
export function Booking() {
  const [kind, setKind] = useState<Kind>("intro");
  const [dark, setDark] = useState(false);
  const [booked, setBooked] = useState(false);
  const url = kind === "intro" ? INTRO : PAID;

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const p = new URLSearchParams(window.location.search);
    if (p.get("booked") === "1") {
      // Cal ID's "redirect on booking" can land here inside the iframe: lift it to the full page.
      if (window.top && window.top !== window) {
        window.top.location.href = window.location.href;
        return;
      }
      setBooked(true);
    }
  }, []);

  // Cal.com-style embeds post a message to the parent page when a booking succeeds.
  useEffect(() => {
    const hosts = [INTRO, PAID].filter(Boolean).map((u) => new URL(u).hostname);
    const on = (e: MessageEvent) => {
      let host = "";
      try {
        host = new URL(e.origin).hostname;
      } catch {
        return;
      }
      if (!hosts.some((h) => host === h || host.endsWith("." + h.replace(/^www\./, "")))) return;
      const d = e.data as { originator?: string; method?: string; type?: string } | null;
      const m = d?.method || d?.type || "";
      if (/bookingSuccessful/i.test(m)) setBooked(true);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);

  const src = useMemo(() => (url ? embedUrl(url, dark) : ""), [url, dark]);

  if (booked) {
    return (
      <div role="status" className="rounded-[24px] border border-line bg-surface p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-lilac text-indigo">
          <Icon name="check" size={22} />
        </span>
        <p className="t-h3 mt-4 text-ink">Booked. A calendar invite is on its way.</p>
        <p className="mt-2 text-muted">Check your inbox (and spam, just in case). You can reschedule from the invite.</p>
      </div>
    );
  }

  const options: { k: Kind; title: string; meta: string; price: string; ready: boolean }[] = [
    { k: "intro", title: "Intro call", meta: "30 min", price: "Free", ready: Boolean(INTRO) },
    // OWNER REVIEW: confirm the paid session length shown here.
    { k: "paid", title: "Deep-dive session", meta: "Paid", price: "₹99", ready: Boolean(PAID) },
  ];

  return (
    <div className="rounded-[24px] border border-line bg-surface p-2">
      <div role="tablist" aria-label="Call type" className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <button
            key={o.k}
            role="tab"
            type="button"
            aria-selected={kind === o.k}
            aria-controls="booking-panel"
            onClick={() => {
              setKind(o.k);
              track({ event: "call_booking_start", call_type: o.k === "intro" ? "free_intro" : "paid" });
            }}
            className={`flex min-h-16 flex-col items-start justify-center rounded-[18px] px-4 py-3 text-left transition-colors duration-[160ms] ${
              kind === o.k ? "bg-indigo text-offwhite dark:bg-lilac dark:text-indigo" : "text-ink hover:bg-ink/[0.04]"
            }`}
          >
            <span className="font-semibold">{o.title}</span>
            <span className={`text-sm ${kind === o.k ? "opacity-80" : "text-muted"}`}>
              {o.meta} · {o.price}
            </span>
          </button>
        ))}
      </div>
      <div id="booking-panel" role="tabpanel" className="mt-2 overflow-hidden rounded-[18px]">
        {src ? (
          <>
            <iframe key={src} src={src} title={`Book: ${options.find((o) => o.k === kind)!.title}`} loading="lazy" className="h-[720px] w-full border-0 bg-surface" allow="payment" />
            <p className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 text-sm text-muted">
              Calendar not loading?
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="link inline-flex items-center gap-1 font-semibold text-ink"
                onClick={() => track({ event: "call_booking_start", call_type: kind === "intro" ? "free_intro" : "paid" })}
              >
                Open the booking page <Icon name="arrow-right" size={15} />
              </a>
            </p>
          </>
        ) : (
          <p className="p-8 text-center text-muted">
            {kind === "paid" ? "Paid sessions open soon. Book the free intro call for now." : "Booking opens soon."}{" "}
            <a href="mailto:marketersbuffet@gmail.com" className="underline underline-offset-2">
              Or email me
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
