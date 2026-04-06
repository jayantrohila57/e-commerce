import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Returns & exchanges",
  description: `Return and exchange policy guidance for ${site.name} customers.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/support/returns",
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
