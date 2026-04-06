import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Frequently Asked Questions",
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
    <Shell>
      <Shell.Section>
        <Section title={pageHeading.title} description={pageHeading.description}>
          <h1>{"Page"}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
