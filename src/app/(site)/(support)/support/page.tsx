import { SupportQuickLinkGrid } from "@/module/site/support-hub";
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
    <Shell.Section>
      <Section
        title="Support"
        description={`Find answers about orders, shipping, and returns — or reach the ${site.name} team directly.`}
      >
        <SupportQuickLinkGrid />
      </Section>
    </Shell.Section>
  );
}
