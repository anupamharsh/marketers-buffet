"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "@/components/brand/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { IconSearch, IconMenu } from "@/components/ui/Icons";
import { openSearch, SearchOverlay, type SearchItem } from "./SearchOverlay";
import { MobileMenu } from "./MobileMenu";

export function Header({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mod, setMod] = useState("Ctrl");
  const last = useRef(0);

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setMod("⌘");
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 420 && y > last.current + 2);
        if (y < last.current - 2 || y < 420) setHidden(false);
        last.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-soft)] ${
          hidden && !menu ? "-translate-y-full" : "translate-y-0"
        } ${scrolled && !menu ? "border-b border-line bg-paper/95" : "border-b border-transparent bg-transparent"}`}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
          <Link href="/" aria-label="Marketers Buffet, home" className="relative z-[2] -m-2 rounded-xl p-2 text-[1.2rem] md:text-[1.3rem]">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className="group relative inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium tracking-[-0.01em] text-ink"
                  >
                    <span className="link-draw" aria-current={isActive(n.href) ? "page" : undefined}>
                      {n.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[2] flex items-center gap-2">
            <button
              onClick={openSearch}
              className="group flex h-11 items-center gap-2 rounded-full px-3 text-ink transition-colors hover:bg-ink/5"
              aria-label="Search (Ctrl or Command + K)"
            >
              <IconSearch size={20} />
              <kbd className="hidden rounded-md border border-line bg-white px-1.5 py-0.5 font-sans text-[0.7rem] font-semibold text-slate xl:inline">
                {mod} K
              </kbd>
            </button>
            <span className="hidden sm:inline-flex">
              <Magnetic>
                <Link href="/book-a-call" className="btn btn-primary btn-sm">
                  Book a call
                </Link>
              </Magnetic>
            </span>
            <button
              onClick={() => setMenu((m) => !m)}
              className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Close menu" : "Open menu"}
            >
              <IconMenu size={22} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <SearchOverlay index={searchIndex} />
    </>
  );
}
