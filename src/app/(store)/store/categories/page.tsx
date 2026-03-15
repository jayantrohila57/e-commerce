import { apiServer, HydrateClient } from "@/core/api/api.server";
import CategoriesListing from "@/module/category/category.component.listing";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";

export const metadata = {
  title: "Categories",
  description: "Update categories details",
};

export default async function CategoriesPage() {
  const { data } = await apiServer.category.getMany({
    query: {},
  });

  return (
    <Shell>
      <Shell.Section>
        <HydrateClient>
          <Section {...metadata}>
            <CategoriesListing data={data} />
          </Section>
        </HydrateClient>
      </Shell.Section>
    </Shell>
  );
}
