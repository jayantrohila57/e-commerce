import type { Route } from "next";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { CategoriesSection } from "@/module/category/category.component.section";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export default async function CategoriesPage() {
  const { data } = await apiServer.category.getManyByTypes({
    query: {},
  });
  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title="Category Management"
            description="Manage your product categories and subcategories"
            action="Add Category"
            actionUrl={PATH.STUDIO.CATEGORIES.NEW as Route}
          >
            <CategoriesSection data={data} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
