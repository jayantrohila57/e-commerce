import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Help Center",
  description: `Find answers and resources for ${site.name} customers.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/help-center",
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
