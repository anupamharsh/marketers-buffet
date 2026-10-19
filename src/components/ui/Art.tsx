import type { Art as ArtSpec, Glow } from "@/content/types";
import { rich } from "@/lib/text";
import { Cloche } from "@/components/brand/Cloche";
import { FileBadge, GoodBad, Notification, SearchBar } from "./Props";

/**
 * Generated cover art. Every card gets a composed scene (texture + glow + one
 * UI prop) instead of a stock photo, so the grid looks designed, not templated.
 */
export function Art({ art, size = "md", className = "" }: { art: ArtSpec; size?: "sm" | "md" | "lg"; className?: string }) {
  const glow: Glow = art.glow ?? "mint";
  const dark = glow === "dark";
  const pad = size === "lg" ? "p-8 sm:p-12" : size === "sm" ? "p-5" : "p-6 sm:p-8";

  return (
    <div
      className={`relative isolate overflow-hidden ${dark ? "on-dark bg-charcoal" : "bg-paper"} ${className}`}
      aria-hidden
    >
      <Glows glow={glow} />
      <div className={`absolute inset-0 ${texture(art.kind)} opacity-90`} />
      <div className={`relative flex h-full w-full items-center ${pad}`} data-art-inner>
        <Scene art={art} size={size} />
      </div>
    </div>
  );
}

function texture(kind: ArtSpec["kind"]) {
  switch (kind) {
    case "compare":
      return "tex-ruled";
    case "search":
    case "file":
      return "tex-grid";
    default:
      return "tex-dots";
  }
}

export function Glows({ glow }: { glow: Glow }) {
  return (
    <>
      {(glow === "mint" || glow === "both") && (
        <span className="glow glow-mint" style={{ width: "120%", left: "-45%", bottom: "-70%" }} />
      )}
      {(glow === "lavender" || glow === "both") && (
        <span className="glow glow-lavender" style={{ width: "110%", right: "-45%", top: "-65%" }} />
      )}
      {glow === "dark" && <span className="glow glow-basil" style={{ width: "140%", left: "-20%", bottom: "-95%" }} />}
    </>
  );
}

function Scene({ art, size }: { art: ArtSpec; size: "sm" | "md" | "lg" }) {
  const scale = size === "lg" ? "origin-left sm:scale-[1.22]" : size === "sm" ? "origin-left scale-[0.82]" : "origin-left scale-[0.92]";
  switch (art.kind) {
    case "notification":
      return (
        <div className={`w-full ${scale}`}>
          <div className="relative">
            <div className="absolute inset-x-6 -bottom-3 h-full rounded-[22px] border border-line bg-white/70" />
            <div className="absolute inset-x-3 -bottom-1.5 h-full rounded-[22px] border border-line bg-white/90" />
            <Notification
              className="relative" app={art.app} letter={art.appLetter} title={art.title} body={art.body} time={art.time} />
          </div>
        </div>
      );
    case "compare":
      return <GoodBad bad={art.bad} good={art.good} className={scale} />;
    case "search":
      return (
        <div className={`w-full ${scale}`}>
          <SearchBar query={art.query} />
          <div className="mt-3 ml-5 grid max-w-[300px] gap-2">
            {[0.92, 0.7, 0.8].map((w, i) => (
              <span key={i} className="h-2.5 rounded-full bg-ink/[0.07]" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
        </div>
      );
    case "quote":
      return (
        <p
          className={`max-w-[13ch] font-bold leading-[0.98] tracking-[-0.045em] text-ink ${
            size === "lg" ? "text-[clamp(2.5rem,5vw,4.5rem)]" : "text-[clamp(1.75rem,3vw,2.6rem)]"
          }`}
        >
          {rich(art.text)}
        </p>
      );
    case "stat":
      return (
        <div className="flex items-end gap-4">
          <span className={`t-num ${size === "lg" ? "text-[10rem]" : "text-[7.5rem]"}`}>{art.value}</span>
          <span className="mb-4 max-w-[12ch] text-base font-medium leading-tight text-slate">{art.text}</span>
        </div>
      );
    case "hooks":
      return (
        <div className={`grid w-full max-w-[400px] gap-2 ${scale}`}>
          {art.lines.map((l, i) => (
            <div
              key={l}
              className="card flex items-center gap-3 px-4 py-3"
              style={{ transform: `translateX(${i * 14}px)`, opacity: 1 - i * 0.12 }}
            >
              <span className="t-num w-6 text-2xl">{i + 1}</span>
              <span className="text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">{l}</span>
            </div>
          ))}
        </div>
      );
    case "file":
      return (
        <div className={`relative w-full max-w-[340px] ${scale}`}>
          <div className="absolute left-6 top-3 h-full w-full rotate-[4deg] rounded-[20px] border border-line bg-white/70" />
          <div className="card relative p-5">
            <div className="flex items-center justify-between">
              <Cloche className="h-7 w-auto" />
              <div className="flex gap-1.5">
                {art.files.map((f) => (
                  <FileBadge key={f} type={f} />
                ))}
              </div>
            </div>
            <p className="mt-6 text-2xl font-bold tracking-[-0.035em] text-ink">{art.name}</p>
            <div className="mt-4 grid gap-2">
              {[1, 0.86, 0.64].map((w, i) => (
                <span key={i} className="h-2 rounded-full bg-ink/[0.07]" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
          </div>
        </div>
      );
  }
}
