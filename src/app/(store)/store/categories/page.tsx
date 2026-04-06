import { apiServer, HydrateClient } from "@/core/api/api.server";
import CategoriesListing from "@/module/category/category.component.listing";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { site } from "@/shared/config/site";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";

const pageHeading = {
  title: "Categories",
  description: `Browse all product categories at ${site.name}.`,
};

export const metadata = buildPageMetadata({
  title: pageHeading.title,
  description: pageHeading.description,
  canonicalPath: "/store/categories",
  ogType: "website",
});

export default async function CategoriesPage() {
  const { data } = await apiServer.category.getMany({
    query: {},
  });

  return (
    <Shell>
      <Shell.Section>
        <HydrateClient>
          <Section {...pageHeading}>
            <CategoriesListing data={data} />
          </Section>
        </HydrateClient>
      </Shell.Section>
    </Shell>
  );
}
