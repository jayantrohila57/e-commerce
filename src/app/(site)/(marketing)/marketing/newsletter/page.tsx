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

export const metadata = {
  title: "Newsletter",
  description: `Subscribe to ${site.name} for updates and offers.`,
};

export default function Page() {
  return (
    <Shell>
      <Shell.Section>
        <ContentAnnouncementBar page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentSplitBanner page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <Section title={metadata.title} description={metadata.description}>
          <h1>{metadata.title}</h1>
          <p>{metadata.description}</p>
        </Section>
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="newsletter" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="newsletter" />
      </Shell.Section>
    </Shell>
  );
}
