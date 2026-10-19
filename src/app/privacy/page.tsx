import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy _Policy._" updated="19 Oct 2026" intro="What gets collected, why, where it goes, and how to get it deleted.">
      <p>
        This policy explains how Marketers Buffet handles your personal data. It is written to follow India&apos;s Digital Personal Data Protection Act,
        2023 (DPDP Act). We only collect what we need, and we never sell it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Email address</strong> when you sign up to the newsletter, download a template, buy something or book a call.</li>
        <li><strong>Name</strong> when you book a call, buy a template or leave a comment.</li>
        <li><strong>Booking details</strong>: the time you pick and what you want to talk about.</li>
        <li><strong>Usage data</strong> (pages visited, device type, approximate location) only if you accept analytics cookies.</li>
      </ul>
      <h2>Why we collect it</h2>
      <ul>
        <li>To send the newsletter you asked for.</li>
        <li>To deliver templates and receipts.</li>
        <li>To run calls you booked, including confirmations and reminders.</li>
        <li>To understand which content is useful, if you allow analytics.</li>
      </ul>
      <h2>Who receives it</h2>
      <p>We use a small set of service providers that process data on our behalf:</p>
      <ul>
        <li>Email tool, for the newsletter and transactional emails.</li>
        <li>Google Analytics 4, via Google Tag Manager, only with your consent.</li>
        <li>Meta Pixel, only with your consent to marketing cookies.</li>
        <li>Payment provider, for paid templates and sessions. We never see or store your card details.</li>
        <li>Calendar and video tool, for booked calls.</li>
      </ul>
      <h2>How long we keep it</h2>
      <p>Newsletter data is kept until you unsubscribe. Purchase records are kept as long as the law requires. Booking details are deleted 12 months after the call.</p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your data at any time, and you can withdraw consent. Every newsletter has a one-click unsubscribe link.
        To ask for anything else, email us and we&apos;ll respond within 30 days.
      </p>
    </LegalPage>
  );
}
