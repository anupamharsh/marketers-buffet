"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { legal, nav, site } from "@/content/site";
import { track } from "@/lib/analytics";
import { Cloche } from "@/components/brand/Cloche";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { OPEN_COOKIES } from "./CookieBanner";

/**
 * Same footer on every page. Inner pages get a small newsletter sign-up above
 * the footer links; the homepage never does.
 */
export function Footer() {
  const path = usePathname();
  // Not on the homepage (handoff), and not on /newsletter, which is already the sign-up.
  const home = path === "/" || path === "/newsletter";
  return (
    <footer className="mt-auto" aria-label="Site footer">
      {!home ? (
        <section className="shell pb-16 pt-6" aria-label="Newsletter">
          <div className="flex flex-col gap-5 rounded-[24px] border border-line bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="t-h3 text-ink">What moved in marketing this fortnight.</p>
              <p className="mt-1 text-sm text-muted">Every two weeks · 5-minute read · Free</p>
            </div>
            <div className="w-full md:max-w-md">
              <NewsletterForm location="footer" variant="compact" />
            </div>
          </div>
        </section>
      ) : null}

      <div className="on-dark grain relative bg-indigo">
        <div className="shell relative z-[1] pb-8 pt-16 md:pt-20">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Cloche className="h-11 w-auto text-offwhite" highlight="#1A0B4B" />
              <p className="mt-6 text-[clamp(1.9rem,3.6vw,2.7rem)] font-semibold leading-[1] tracking-[-0.045em]">
                The work behind <span className="block text-lilac">the work.</span>
              </p>
            </div>
            <div>
              <p className="mb-4 text-sm text-[#c9c3dd]">Explore</p>
              <ul className="grid gap-1">
                {[...nav, { href: "/book-a-call", label: "Book a call" }].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="link inline-flex min-h-9 items-center text-[0.95rem]">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm text-[#c9c3dd]">About</p>
              <ul className="grid gap-1 text-[0.95rem]">
                <li>
                  <Link href="/about" className="link inline-flex min-h-9 items-center">
                    About
                  </Link>
                </li>
                <li>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" onClick={() => track({ event: "social_click", platform: "instagram" })} className="link inline-flex min-h-9 items-center">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => track({ event: "social_click", platform: "linkedin" })} className="link inline-flex min-h-9 items-center">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="link inline-flex min-h-9 items-center break-all">
                    {site.email}
                  </a>
                </li>
                <li>
                  <a href={site.phoneHref} className="link inline-flex min-h-9 items-center">
                    {site.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.8125rem] text-[#c9c3dd] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Marketers Buffet</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" className="link" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIES))}>
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
