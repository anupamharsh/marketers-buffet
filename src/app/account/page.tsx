import type { Metadata } from "next";
import { Account } from "@/components/account/Account";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="shell pb-24 pt-32 md:pt-40">
      <p className="t-label mb-5">Account</p>
      <h1 className="t-h1 text-ink">
        Your <span className="tail">account.</span>
      </h1>
      <div className="mt-10">
        <Account />
      </div>
    </div>
  );
}
