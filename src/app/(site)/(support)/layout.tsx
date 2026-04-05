import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import Shell from "@/shared/components/layout/shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Section>
        <ContentAnnouncementBar page="support" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="support" />
      </Shell.Section>
      <Shell.Section>
        <ContentSplitBanner page="support" />
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="support" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="support" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="support" />
      </Shell.Section>
      {children}
    </Shell>
  );
}
