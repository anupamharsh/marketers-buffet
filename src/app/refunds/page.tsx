import type { Metadata } from "next";
import { site } from "@/content/site";
import { Legal } from "@/components/legal/Legal";

export const metadata: Metadata = { title: "Refund policy", alternates: { canonical: "/refunds" } };

export default function RefundsPage() {
  return (
    <Legal title="Refund policy" updated="19/10/26">
      <h2>Digital downloads</h2>
      <p>
        <strong>No refunds on digital downloads.</strong> Once a template or playbook is paid for, the files are yours to download straight away, so we can&apos;t take them back.
      </p>
      <p>If a file is broken, missing or not what the page described, email us within 7 days and we&apos;ll fix it or send the right file.</p>
      <h2>Paid calls</h2>
      {/* OWNER REVIEW: confirm the paid-call cancellation rule. */}
      <p>You can reschedule a paid call from your calendar invite up to 24 hours before it starts. If we have to cancel, you get a full refund.</p>
      <h2>How refunds are paid</h2>
      <p>Approved refunds go back to the original payment method through Razorpay, usually within 5 to 7 working days.</p>
      <p>
        Email: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </Legal>
  );
}
