import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { Legal } from "@/components/legal/Legal";

export const metadata: Metadata = { title: "Terms of use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <Legal title="Terms of use" updated="19/10/26">
      <p>By using Marketers Buffet, you agree to these terms. They&apos;re short on purpose.</p>
      <h2>The content</h2>
      <p>Posts, automations and AI examples share what worked for one marketer. They are not professional, legal or financial advice. Test before you rely on anything here.</p>
      <h2>Templates and playbooks</h2>
      <p>When you download or buy a template, you get a personal licence to use it in your own work and your clients&apos; work. You may not resell, share or publish the files themselves.</p>
      <h2>Payments</h2>
      <p>
        Prices are in Indian rupees. Payments are handled by Razorpay. Digital downloads are not refundable; see the <Link href="/refunds">refund policy</Link>.
      </p>
      <h2>Comments</h2>
      <p>Comments are checked before they go live. We may edit, hide or remove comments that are spam, abusive or off-topic, and block repeat offenders.</p>
      <h2>Accounts</h2>
      <p>Keep access to your email or Google account safe, since that is how you sign in. We may close accounts that misuse the site.</p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </Legal>
  );
}
