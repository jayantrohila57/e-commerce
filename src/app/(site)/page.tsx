import GetFeaturedCategories from "@/module/category/category.get-featured";
import ShopByCategoryGrid from "@/module/category/category.shop-by";
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
        <GetFeaturedCategories />
      </Shell.Section>
      <Shell.Section>
        <ShopByCategoryGrid />
      </Shell.Section>
    </Shell>
  );
}
