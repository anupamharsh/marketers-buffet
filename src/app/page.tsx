import { About, AiEdgeSection, Automations, Behind, BookCall, Dashes, Hero, LatestRead, NewsletterSection, TemplatesSection } from "@/components/home/Sections";

/* Homepage, in the order of the design. Sections alternate light and dark. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <LatestRead />
      <Automations />
      <AiEdgeSection />
      <div className="h-4" />
      <TemplatesSection />
      <div className="h-4" />
      <NewsletterSection />
      <BookCall />
      <Dashes />
      <Behind />
    </>
  );
}
