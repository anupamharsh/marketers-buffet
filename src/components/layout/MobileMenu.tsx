"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { nav, site } from "@/content/site";
import { Logo } from "@/components/brand/Cloche";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "./ThemeToggle";

export function MobileMenu({ open, onClose, signedIn }: { open: boolean; onClose: () => void; signedIn: boolean }) {
  const first = useRef<HTMLAnchorElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      className="on-dark grain fixed inset-0 z-[120] flex flex-col bg-indigo text-offwhite lg:hidden"
    >
      <div className="shell flex h-[68px] items-center justify-between">
        <Link href="/" onClick={onClose} className="text-[1.05rem]" aria-label="Marketers Buffet, home">
          <Logo highlight="#1A0B4B" />
        </Link>
        <span className="flex items-center gap-1.5">
          <ThemeToggle />
          <button onClick={onClose} className="icon-btn" aria-label="Close menu">
            <Icon name="x" size={18} />
          </button>
        </span>
      </div>
      <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center">
        <ul className="grid gap-1">
          {nav.map((n, i) => (
            <li key={n.href}>
              <Link
                ref={i === 0 ? first : undefined}
                href={n.href}
                onClick={onClose}
                className="block py-1.5 text-[clamp(2.2rem,10vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] transition-colors duration-[160ms] hover:text-lilac"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/book-a-call" onClick={onClose} className="btn btn-lilac">
            Book a call
          </Link>
          <Link href={signedIn ? "/account" : "/signin"} onClick={onClose} className="btn btn-ghost">
            <Icon name="user" size={16} /> {signedIn ? "Account" : "Sign in"}
          </Link>
        </div>
      </nav>
      <div className="shell flex items-center justify-between pb-8 text-sm text-[#c9c3dd]">
        <span>{site.tagline}</span>
        <span className="flex gap-4">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </span>
      </div>
    </div>
  );
}
