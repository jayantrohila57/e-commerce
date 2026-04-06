import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

export const metadata = buildPageMetadata({
  title: "Support",
  description: `Help and support resources for ${site.name} customers.`,
  canonicalPath: "/support",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <Section title="Support" description="Get help with any issues or questions you may have.">
          <h1>{"Support Page"}</h1>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
