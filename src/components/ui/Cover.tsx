import Image from "next/image";
import type { Cover as CoverT } from "@/content/types";

/** Pattern cover from the homepage family (or a real image when set in the CMS). */
export function Cover({ cover, className = "", sizes = "(min-width: 1024px) 33vw, 100vw", priority = false }: { cover: CoverT; className?: string; sizes?: string; priority?: boolean }) {
  if (cover.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={cover.image.src} alt={cover.image.alt} fill sizes={sizes} className="object-cover" priority={priority} />
      </div>
    );
  }
  return <div aria-hidden className={`pat grain pat-${cover.tone ?? "indigo"} ${className}`} data-shape={cover.shape} />;
}
