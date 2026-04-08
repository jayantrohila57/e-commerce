import { FAQSection } from "@/module/site/site.faq";
import { supportFaqItems } from "@/module/site/support-content";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Frequently asked questions",
  description: `Common questions about shopping with ${site.name}, orders, and support.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/faq",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell.Section>
      <Section title={pageHeading.title} description={pageHeading.description}>
        <FAQSection data={supportFaqItems} />
      </Section>
    </Shell.Section>
  );
}
