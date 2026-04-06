import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Shipping information",
  description: `Shipping options and delivery details for ${site.name} orders.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/shipping",
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
