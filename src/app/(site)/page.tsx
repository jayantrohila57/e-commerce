import GetFeaturedCategories from "@/module/category/category.get-featured";
import ShopByCategoryGrid from "@/module/category/category.shop-by";
import { ContentCTA, ContentFeatureHighlights, ContentOfferBanner } from "@/module/site/content-sections";
import SiteHero from "@/module/site/site.hero";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";

export const metadata = {
  title: site.name,
  description: site.description,
};

export default async function Home({}: PageProps<"/">) {
  return (
    <Shell>
      <Shell.Section>
        <SiteHero />
      </Shell.Section>
      <Shell.Section>
        <GetFeaturedCategories />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="home" />
      </Shell.Section>
      <Shell.Section>
        <ShopByCategoryGrid />
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="home" />
      </Shell.Section>
    </Shell>
  );
}
