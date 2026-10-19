"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { nav, site } from "@/content/site";
import { useLenis } from "@/components/motion/SmoothScroll";
import { Logo } from "@/components/brand/Logo";
import { IconArrow, IconClose } from "@/components/ui/Icons";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClose = () => closeRef.current();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.set(el, { display: "flex" });
      const tl = gsap.timeline();
      tl.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" });
      tl.fromTo(el.querySelectorAll("[data-m]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "-=0.3");
      tl.fromTo(el.querySelectorAll("[data-m-fade]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.6");
      el.querySelector<HTMLElement>("[data-m-first]")?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else if (el.style.display === "flex") {
      lenis?.start();
      document.body.style.overflow = "";
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.55,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
    }
  }, [open, lenis]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className="fixed inset-0 z-[110] hidden flex-col bg-paper lg:hidden"
      style={{ display: "none" }}
    >
      <div className="tex-dots pointer-events-none absolute inset-0" />
      <span className="glow glow-mint" style={{ width: "120vw", left: "-50vw", bottom: "-60vw" }} />
      <div className="shell relative flex h-[72px] items-center justify-between">
        <Link href="/" onClick={onClose} className="text-[1.2rem]" aria-label="Marketers Buffet, home" tabIndex={open ? 0 : -1}>
          <Logo />
        </Link>
        <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Close menu" tabIndex={open ? 0 : -1}>
          <IconClose size={22} />
        </button>
      </div>
      <nav aria-label="Mobile" className="shell relative flex flex-1 flex-col justify-center">
        <ul className="grid gap-1">
          {[...nav, { href: "/book-a-call", label: "Book a call" }].map((n, i) => (
            <li key={n.href} className="overflow-hidden">
              <Link
                href={n.href}
                onClick={onClose}
                data-m
                {...(i === 0 ? { "data-m-first": "" } : {})}
                tabIndex={open ? 0 : -1}
                className="group flex items-center justify-between py-1.5 text-[clamp(2.4rem,11vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.045em] text-ink"
              >
                {n.label === "Book a call" ? (
                  <span>
                    Book a <span className="serif serif-basil">call</span>
                  </span>
                ) : (
                  n.label
                )}
                <IconArrow size={28} className="text-basil opacity-0 transition-opacity group-focus-visible:opacity-100 group-active:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="shell relative flex items-center justify-between gap-4 pb-8 text-sm font-medium text-slate" data-m-fade>
        <span>Take what you need.</span>
        <span className="flex gap-4">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="min-h-11 py-3" tabIndex={open ? 0 : -1}>
            Instagram
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="min-h-11 py-3" tabIndex={open ? 0 : -1}>
            LinkedIn
          </a>
        </span>
      </div>
    </div>
  );
}
