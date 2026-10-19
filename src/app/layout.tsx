import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { posts } from "@/content/posts";
import { templates } from "@/content/templates";
import { library } from "@/content/library";
import { formatLabel } from "@/content/types";
import { plain } from "@/lib/text";
import { CONSENT_DEFAULTS_SCRIPT } from "@/lib/consent";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Analytics } from "@/components/layout/Analytics";
import { Toaster } from "@/components/ui/Toaster";
import type { SearchItem } from "@/components/layout/SearchOverlay";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Marketers Buffet · A lot of marketing. Take what you need.", template: "%s · Marketers Buffet" },
  description: site.description,
  applicationName: site.name,
  // Anonymity: the author is always the brand, never a person.
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Marketers Buffet" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#1E4D3E",
  width: "device-width",
  initialScale: 1,
};

function buildSearchIndex(): SearchItem[] {
  return [
    ...posts.map((p) => ({
      kind: "Post" as const,
      title: plain(p.title),
      sub: `${formatLabel(p.format)} · ${p.hook}`,
      href: `/blog/${p.slug}`,
      keywords: [...p.topics, p.format].join(" "),
    })),
    ...templates.map((t) => ({
      kind: "Template" as const,
      title: t.name,
      sub: `${t.price ? "Paid" : "Free"} · ${t.line}`,
      href: `/templates/${t.slug}`,
      keywords: t.files.map((f) => f.type).join(" "),
    })),
    ...library.map((l) => ({
      kind: "Library" as const,
      title: l.title,
      sub: `${l.brand} · ${l.sample}`,
      href: `/library?item=${l.id}`,
      keywords: [l.kind, l.industry, ...l.ideas].join(" "),
    })),
  ];
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <Header searchIndex={buildSearchIndex()} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <Toaster />
          <Analytics />
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
