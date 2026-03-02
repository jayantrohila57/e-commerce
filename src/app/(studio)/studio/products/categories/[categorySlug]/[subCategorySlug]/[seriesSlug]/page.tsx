import { HydrateClient } from "@/core/api/api.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function SeriesPage({
  params,
}: PageProps<"/studio/products/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]">) {
  const { categorySlug: slug, subCategorySlug: sub, seriesSlug: series } = await params;

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(sub)}
            description="Manage your product categories and subcategories"
            // action="Add Sub Category"
            // actionUrl={PATH.STUDIO.PRODUCTS.CATEGORIES.SUB_CATEGORIES.NEW(String(data?.category?.id), slug) as Route}
          >
            <div className="grid h-full w-full grid-cols-6 gap-2">
              <div className="bg-muted col-span-2 h-full w-full rounded-md p-3">
                <h2 className="text-lg font-semibold">Category Details</h2>
                <pre className="overflow-auto font-mono text-sm wrap-break-word whitespace-pre-wrap">
                  {JSON.stringify({ slug, sub }, null, 2)}
                </pre>
              </div>
              <div className="bg-muted col-span-4 h-full w-full rounded-md p-3"></div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
