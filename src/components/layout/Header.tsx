"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import type { SearchItem } from "@/content";
import { Logo } from "@/components/brand/Cloche";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/components/providers/AuthProvider";
import { openSearch, SearchPanel } from "./SearchPanel";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

/**
 * Navbar (handoff): full bar at the top of the homepage; after ~120px it
 * becomes a floating, see-through capsule (280ms ease-out, 18px blur).
 * Inner pages always show the capsule.
 */
export function Header({ searchIndex }: { searchIndex: SearchItem[] }) {
  const path = usePathname();
  const home = path === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    let raf = 0;
    let last = false;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = window.scrollY > 120;
        if (next !== last) setScrolled((last = next));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);

  useEffect(() => setMenu(false), [path]);

  const capsule = !home || scrolled;
  const active = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
        <div
          className={`on-dark pointer-events-auto mx-auto flex items-center justify-between gap-4 text-offwhite transition-[max-width,margin,padding,border-radius,background-color,box-shadow] duration-[280ms] ease-out ${
            capsule
              ? "mt-3 max-w-[1180px] rounded-full bg-indigo/80 px-3 py-2 shadow-[0_12px_32px_-16px_rgba(26,11,75,0.6)] ring-1 ring-white/10 backdrop-blur-[18px] [margin-inline:max(0.75rem,calc((100%-1180px)/2))] sm:px-4"
              : "mt-0 max-w-[1440px] rounded-none bg-transparent px-[clamp(1.25rem,5vw,4.75rem)] py-5"
          }`}
        >
          <Link href="/" aria-label="Marketers Buffet, home" className="rounded-xl px-2 py-1.5 text-[1.05rem]">
            <Logo highlight="#1A0B4B" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active(n.href) ? "page" : undefined}
                    className="link inline-flex min-h-10 items-center rounded-full px-3.5 text-[0.9rem] font-medium"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={openSearch} className="icon-btn" aria-label="Search (Ctrl or Command + K)">
              <Icon name="search" size={17} />
            </button>
            <ThemeToggle className="hidden lg:grid" />
            <Link href={session ? "/account" : "/signin"} className="icon-btn hidden lg:grid" aria-label={session ? "Your account" : "Sign in"}>
              <Icon name="user" size={17} />
            </Link>
            <Link href="/book-a-call" className="btn btn-lilac btn-sm hidden lg:inline-flex !min-h-10">
              Book a call
            </Link>
            <button
              onClick={() => setMenu(true)}
              className="icon-btn lg:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <Icon name="menu-2" size={18} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} signedIn={Boolean(session)} />
      <SearchPanel index={searchIndex} />
    </>
  );
}
