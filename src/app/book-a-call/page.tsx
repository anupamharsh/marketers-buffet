import type { Metadata } from "next";
import { CALL_TOPICS } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { Booking } from "@/components/booking/Booking";

export const metadata: Metadata = {
  title: "Book a call",
  description: "An honest chat with someone who does marketing every day. First 30 minutes free.",
  alternates: { canonical: "/book-a-call" },
};

export default function BookACallPage() {
  return (
    <div className="shell grid gap-12 pb-24 pt-32 md:pt-40 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Heading as="h1" size="h1" label="Book a call" lead="Need a second pair" tail="of eyes?" />
        <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-muted">
          No big promises. Just an honest chat with someone who does marketing every day. Feedback, ideas or a fresh angle: if it helps, great. First 30 minutes free.
        </p>
        <p className="t-label mt-10">What we can talk about</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CALL_TOPICS.map((t) => (
            <li key={t} className="pill pill-lilac !h-9 !px-4 !text-[0.875rem]">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-md text-sm text-muted">
          You&apos;ll add your name, email and what you&apos;d like to discuss when you pick a time. The calendar invite includes the video link.
        </p>
      </div>
      <Booking />
    </div>
  );
}
