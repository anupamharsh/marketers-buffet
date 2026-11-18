import type { Metadata } from "next";
import { Moderation } from "@/components/admin/Moderation";

export const metadata: Metadata = { title: "Comments admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <div className="shell pb-24 pt-32 md:pt-40">
      <p className="t-label mb-5">Admin</p>
      <h1 className="t-h1 text-ink">
        Comment <span className="tail">queue.</span>
      </h1>
      <p className="mt-4 max-w-xl text-muted">Every comment waits here until you approve it.</p>
      <div className="mt-10">
        <Moderation />
      </div>
    </div>
  );
}
