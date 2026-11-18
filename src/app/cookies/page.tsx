import type { Metadata } from "next";
import { Legal } from "@/components/legal/Legal";
import { CookieSettingsButton } from "@/components/legal/CookieSettingsButton";

export const metadata: Metadata = { title: "Cookie policy", alternates: { canonical: "/cookies" } };

export default function CookiesPage() {
  return (
    <Legal title="Cookie policy" updated="19/10/26" action={<CookieSettingsButton />}>
      <p>Cookies and similar storage are small pieces of data your browser keeps for a site. Here&apos;s what this site uses. Nothing optional runs unless you say yes.</p>
      <h2>Essential (always on)</h2>
      <ul>
        <li><strong>Theme and cookie choice</strong>, saved in your browser so the site remembers them.</li>
        <li><strong>Sign-in session</strong>, if you sign in.</li>
        <li><strong>mb_did</strong>: a random browser ID used only for spam protection and form limits.</li>
        <li><strong>Cloudflare Turnstile</strong>, which checks that forms are sent by people.</li>
      </ul>
      <h2>Analytics (optional)</h2>
      <p>Google Analytics, through Google Tag Manager, shows which pages are read. Loads only if you accept analytics.</p>
      <h2>Marketing (optional)</h2>
      <p>Meta Pixel measures campaigns. Loads only if you accept marketing.</p>
      <h2>Change your mind</h2>
      <p>Use the Cookie settings button above, or the link in the footer, at any time.</p>
    </Legal>
  );
}
