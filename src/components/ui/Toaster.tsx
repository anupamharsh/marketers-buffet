"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

const EVENT = "mb:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

/** Small confirmation messages. Fades only. */
export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), 3800);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[160] flex justify-center px-4">
      <div
        className={`flex items-center gap-2.5 rounded-full bg-indigo py-2.5 pl-3 pr-5 text-[0.9rem] font-medium text-offwhite shadow-lg transition-opacity duration-[240ms] ${
          msg ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-lilac text-indigo">
          <Icon name="check" size={14} />
        </span>
        {msg ?? ""}
      </div>
    </div>
  );
}
