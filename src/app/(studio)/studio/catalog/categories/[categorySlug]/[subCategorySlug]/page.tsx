import type { Route } from "next";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { SubCategoryPreviewCard } from "@/module/subcategory/subcategory-preview";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function SubCategoryPage({
  params,
}: PageProps<"/studio/catalog/categories/[categorySlug]/[subCategorySlug]">) {
  const { categorySlug: slug, subCategorySlug: sub } = await params;
  const { data } = await apiServer.subcategory.getBySlug({
    params: {
      slug: sub,
      categorySlug: slug,
    },
  });
  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(sub)}
            description="Manage your product categories and subcategories"
            action="Add Product"
            actionUrl={PATH.STUDIO.PRODUCTS.NEW as Route}
          >
            <div className="grid h-full w-full grid-cols-6 gap-2">
              <div className="col-span-6 h-full w-full rounded-md">
                {data && <SubCategoryPreviewCard data={data.subcategoryData} />}
              </div>
              <div className="col-span-6 h-full w-full rounded-md">
                <Separator className="my-2" />
                {/* TODO: Add product listing component here */}
                <p className="text-muted-foreground text-sm">Product listing will be implemented here.</p>
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
