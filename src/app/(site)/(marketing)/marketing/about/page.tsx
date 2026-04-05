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
  title: "About",
  description: `Learn more about ${site.name} and what we offer.`,
};

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
        <Section title={metadata.title} description={metadata.description}>
          <h1>{metadata.title}</h1>
          <p>{metadata.description}</p>
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
