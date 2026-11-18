import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { searchIndex } from "@/content";
import { CONSENT_DEFAULTS_SCRIPT } from "@/lib/consent";
import { THEME_SCRIPT } from "@/lib/theme";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Analytics } from "@/components/layout/Analytics";
import { Toaster } from "@/components/ui/Toaster";
import { Fades } from "@/components/ui/Fades";

// General Sans (Fontshare, ITF Free Font License: free for commercial use), self-hosted.
const generalSans = localFont({
  src: [
    { path: "../fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/GeneralSans-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-general",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Marketers Buffet · The work behind the work.", template: "%s · Marketers Buffet" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { type: "website", siteName: site.name, images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Marketers Buffet" }] },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1A0B4B" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={generalSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT + CONSENT_DEFAULTS_SCRIPT }} />
      </head>
      {/* Browser extensions add attributes to <body> before React loads; ignore only those. */}
      <body suppressHydrationWarning className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>
          <Header searchIndex={searchIndex()} />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <Toaster />
          <Analytics />
          <Fades />
        </AuthProvider>
      </body>
    </html>
  );
}
