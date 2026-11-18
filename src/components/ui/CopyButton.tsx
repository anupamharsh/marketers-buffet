"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";

/** Obvious Copy button for prompt boxes and code. */
export function CopyButton({
  text,
  page = "",
  className = "",
  label = "Copy",
  variant = "ghost",
}: {
  text: string;
  page?: string;
  className?: string;
  label?: string;
  variant?: "ghost" | "primary";
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`btn btn-sm ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          track({ event: "prompt_copy", page });
          window.setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
      aria-live="polite"
    >
      <Icon name={done ? "check" : "copy"} size={15} />
      {done ? "Copied" : label}
    </button>
  );
}
