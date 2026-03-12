import GetFeaturedCategories from "@/module/category/category.get-featured";
import ShopByCategoryGrid from "@/module/category/category.shop-by";
import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import SiteHero from "@/module/site/site.hero";
import Shell from "@/shared/components/layout/shell";

export const metadata = {
  title: "Home",
  description: "Home Description",
};

export default async function Home({}: PageProps<"/">) {
  return (
    <Shell>
      <Shell.Section>
        <SiteHero />
      </Shell.Section>
      <Shell.Section>
        <ContentAnnouncementBar page="home" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="home" />
      </Shell.Section>
      <Shell.Section>
        <ContentSplitBanner page="home" />
      </Shell.Section>
      <Shell.Section>
        <GetFeaturedCategories />
      </Shell.Section>
      <Shell.Section>
        <ShopByCategoryGrid />
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="home" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="home" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="home" />
      </Shell.Section>
    </Shell>
  );
}
