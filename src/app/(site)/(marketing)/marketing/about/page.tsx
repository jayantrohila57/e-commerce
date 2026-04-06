import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "About",
  description: `Learn more about ${site.name} and what we offer.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/marketing/about",
  ogType: "website",
});

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <ContentAnnouncementBar page="about" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="about" />
      </Shell.Section>
      <Shell.Section>
        <ContentSplitBanner page="about" />
      </Shell.Section>
      <Shell.Section>
        <Section title={pageHeading.title} description={pageHeading.description}>
          <h1>{pageHeading.title}</h1>
          <p>{pageHeading.description}</p>
        </Section>
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="about" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="about" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="about" />
      </Shell.Section>
    </Shell>
  );
}
