"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { IconCheck } from "./Icons";

const EVENT = "mb:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

/** Small confirmation messages from the brief ("It's yours. Go make something good."). */
export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), 4200);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  useEffect(() => {
    if (msg && ref.current) gsap.fromTo(ref.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45 });
  }, [msg]);

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4">
      {msg ? (
        <div ref={ref} className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-3 pl-3 pr-5 text-[0.95rem] font-medium text-cream shadow-[var(--shadow-lift)]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-basil">
            <IconCheck size={15} />
          </span>
          {msg}
        </div>
      ) : null}
    </div>
  );
}
