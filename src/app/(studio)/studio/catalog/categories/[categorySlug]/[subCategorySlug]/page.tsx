import type { Route } from "next";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { SeriesSection } from "@/module/series/series-section";
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
            action="Add Series"
            actionUrl={PATH.STUDIO.SERIES.NEW(slug, sub, String(data?.subcategoryData?.id)) as Route}
          >
            <div className="grid h-full w-full grid-cols-6 gap-2">
              <div className="col-span-6 h-full w-full rounded-md">
                {data && <SubCategoryPreviewCard data={data.subcategoryData} />}
              </div>
              <div className="col-span-6 h-full w-full rounded-md">
                <Separator className="my-2" />
                {data?.seriesData && (
                  <SeriesSection
                    subcategorySlug={sub}
                    categorySlug={slug}
                    title="Series"
                    description="Series are displayed on the homepage"
                    series={data?.seriesData ?? []}
                    emptyMessage="No Series"
                  />
                )}
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
