import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Contact Support",
  description: `Get in touch with ${site.name} to ask a question or get help with your order.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/contact",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section {...pageHeading}>
          <h1>{pageHeading.title}</h1>
          <p>{pageHeading.description}</p>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
