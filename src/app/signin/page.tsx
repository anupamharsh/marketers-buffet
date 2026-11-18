import type { Metadata } from "next";
import { SignIn } from "@/components/account/SignIn";

export const metadata: Metadata = { title: "Sign in", robots: { index: false }, alternates: { canonical: "/signin" } };

export default function SignInPage() {
  return (
    <div className="shell grid gap-12 pb-24 pt-32 md:pt-40 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="t-label mb-5">Account</p>
        <h1 className="t-h1 text-ink">
          Sign <span className="tail">in.</span>
        </h1>
        <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted">
          Save posts for later, re-download anything you bought, and see your calls in one place. No passwords: use Google or a one-time code sent to your email.
        </p>
      </div>
      <div className="w-full max-w-md rounded-[24px] border border-line bg-surface p-6 sm:p-8 lg:justify-self-end">
        <SignIn />
      </div>
    </div>
  );
}
