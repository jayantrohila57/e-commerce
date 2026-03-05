import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { CategoryPreviewCard } from "@/module/category/category.component.preview";
import { SubCategorySection } from "@/module/subcategory/subcategories-section";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function CategoryPage({ params }: PageProps<"/studio/products/categories/[categorySlug]">) {
  const { categorySlug: slug } = await params;
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();
  const { data } = await apiServer.category.getCategoryWithSubCategories({
    params: {
      slug,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(slug)}
            description="Manage your product categories and subcategories"
            action="Add Sub Category"
            actionUrl={PATH.STUDIO.SUB_CATEGORIES.NEW(String(data?.id), slug) as Route}
          >
            <div className="grid h-full w-full grid-cols-6 gap-2">
              <div className="col-span-6 h-full w-full rounded-md">{data && <CategoryPreviewCard data={data} />}</div>
              <div className="col-span-6 h-full w-full rounded-md">
                <Separator className="my-2" />
                {data?.subcategories && (
                  <SubCategorySection
                    slug={slug}
                    title="SubCategories"
                    description="Sub categories are displayed on the homepage"
                    categories={data?.subcategories}
                    emptyMessage="No SubCategories"
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
