import { Cloche } from "./Cloche";

/** Small looping "typing" cloche used as the page loader. CSS only. */
export function ClocheLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
      <Cloche dots className="mb-loader h-16 w-auto" />
      <span className="sr-only">{label}</span>
      <style>{`
        .mb-loader .mb-dot{opacity:1;animation:mbDot 1.2s ease-in-out infinite}
        .mb-loader .mb-dot:nth-child(2){animation-delay:.15s}
        .mb-loader .mb-dot:nth-child(3){animation-delay:.3s}
        .mb-loader .mb-highlight{opacity:0}
        @keyframes mbDot{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-10px);opacity:1}}
        @media (prefers-reduced-motion: reduce){.mb-loader .mb-dot{animation:none;opacity:1}}
      `}</style>
    </div>
  );
}
