import type { Route } from "next";
import { HydrateClient } from "@/core/api/api.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function CategoryEdit({
  params,
}: PageProps<"/studio/catalog/categories/[categorySlug]/[subCategorySlug]/edit-subcategory">) {
  const { categorySlug: slug, subCategorySlug: sub } = await params;

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(sub)}
            description="Manage your product categories and subcategories"
            action="Edit Category"
            actionUrl={PATH.STUDIO.CATEGORIES.EDIT(String(slug), slug) as Route}
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
