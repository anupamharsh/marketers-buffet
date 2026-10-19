import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Refund and Cancellation Policy", alternates: { canonical: "/refund-policy" } };

export default function RefundPage() {
  return (
    <LegalPage title="Refunds and _cancellations._" updated="19 Oct 2026" intro="Clear rules, so nobody has to argue about it later.">
      <h2>Paid templates</h2>
      <p>
        Templates are digital files delivered instantly, so they are <strong>not refundable once downloaded</strong>. If a file is broken or not what
        was described, email us and we&apos;ll fix it or send a working version.
      </p>
      <h2>Paid calls</h2>
      <ul>
        <li>You can reschedule for free up to 24 hours before the call.</li>
        <li>Inside 24 hours, the session can&apos;t be moved or refunded.</li>
        <li>If we need to cancel, you get a full refund or a new time, your choice.</li>
      </ul>
      <h2>Free intro calls</h2>
      <p>Free calls can be cancelled or moved at any time. A heads-up is appreciated.</p>
      <h2>Receipts</h2>
      <p>Every purchase comes with an emailed receipt issued by Marketers Buffet.</p>
    </LegalPage>
  );
}
