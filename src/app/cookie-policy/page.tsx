import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Cookie Policy", alternates: { canonical: "/cookie-policy" } };

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie _Policy._" updated="19 Oct 2026" intro="Nothing tracks you until you say yes. Here's what yes means.">
      <h2>Essential</h2>
      <p>Your cookie choice itself is stored in your browser so we don&apos;t ask again. This is always on and contains no personal data.</p>
      <h2>Analytics (optional)</h2>
      <p>
        Google Analytics 4, loaded through Google Tag Manager, shows which pages are read and where visitors come from. It only loads after you accept
        analytics cookies, using Google Consent Mode v2.
      </p>
      <h2>Marketing (optional)</h2>
      <p>Meta Pixel measures whether our Instagram and Facebook campaigns work. It only loads after you accept marketing cookies.</p>
      <h2>Changing your mind</h2>
      <p>Use &ldquo;Cookie settings&rdquo; in the footer at any time to change or withdraw your choice.</p>
    </LegalPage>
  );
}
