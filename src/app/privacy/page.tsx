import type { Metadata } from "next";
import { site } from "@/content/site";
import { Legal } from "@/components/legal/Legal";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <Legal title="Privacy policy" updated="19/10/26">
      <p>
        This policy explains what Marketers Buffet collects, why, where it is stored and how to get it deleted. It is written to follow India&apos;s Digital Personal Data Protection Act, 2023. We only collect what we need, and we never sell it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Email address</strong> when you join the newsletter, download a template, buy something, book a call or sign in.</li>
        <li><strong>Name, position and company</strong> if you add them to a comment or your account settings.</li>
        <li><strong>Purchase records</strong>: what you bought, the amount and the payment reference. We never see or store card or UPI details.</li>
        <li><strong>Booking details</strong>: the time you pick and what you want to talk about.</li>
        <li><strong>Account activity</strong> when signed in: saved items and pages you viewed, so they show in your account.</li>
        <li><strong>Security data</strong>: a one-way hash of your IP address and a random browser ID, used only to stop spam and limit repeated form submissions. We never store your raw IP.</li>
        <li><strong>Usage data</strong> (pages visited, device type, rough location) only if you accept analytics cookies.</li>
      </ul>
      <h2>Who processes it for us</h2>
      <ul>
        <li>Supabase (database, file storage and sign-in), hosted in Singapore.</li>
        <li>Netlify (website hosting).</li>
        <li>Brevo (newsletter and emails).</li>
        <li>Razorpay (payments).</li>
        <li>Cal ID (call booking).</li>
        <li>Cloudflare Turnstile (spam protection on forms).</li>
        <li>Google Analytics and Meta Pixel, only with your consent.</li>
      </ul>
      <h2>How long we keep it</h2>
      <p>Newsletter data until you unsubscribe. Purchase records as long as Indian tax law requires. Comments until you ask us to remove them. Security data for up to 24 hours (rate limits) or as long as a block is in place.</p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your data, and you can withdraw consent at any time. Every newsletter has a one-click unsubscribe link. For anything else, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> and we&apos;ll reply within 30 days.
      </p>
    </Legal>
  );
}
