import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of _Use._" updated="19 Oct 2026" intro="The short version: use what helps you, don't resell it, be decent in the comments.">
      <h2>Content ownership</h2>
      <p>
        Posts, teardowns, templates and designs on this site belong to Marketers Buffet unless stated otherwise. Brands and ads shown in teardowns
        belong to their owners and are discussed for commentary and education.
      </p>
      <h2>Using templates</h2>
      <ul>
        <li>You can use templates, free or paid, for your own work and for client work.</li>
        <li>You can&apos;t resell, redistribute or share them as templates, in original or modified form.</li>
        <li>Paid templates are licensed to the buyer. Teams need one licence per person.</li>
      </ul>
      <h2>Comments</h2>
      <ul>
        <li>Comments are moderated and may be edited or removed.</li>
        <li>No spam, self-promotion, hate, harassment or personal information about others.</li>
        <li>You keep ownership of what you write, and allow us to display it on this site.</li>
      </ul>
      <h2>Calls</h2>
      <p>Calls are for guidance and ideas. They are not legal, financial or other professional advice.</p>
      <h2>Changes</h2>
      <p>We may update these terms. The date at the top of this page shows when they last changed.</p>
    </LegalPage>
  );
}
