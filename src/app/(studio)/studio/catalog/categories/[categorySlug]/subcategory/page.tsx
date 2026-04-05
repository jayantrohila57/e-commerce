import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import SubcategoryTable from "@/module/subcategory/subcategory.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function CategorySubcategoriesTablePage({
  params,
  searchParams,
}: PageProps<"/studio/catalog/categories/[categorySlug]"> & {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { categorySlug } = await params;
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const categoryResult = await apiServer.category.getCategoryWithSubCategories({
    params: { slug: categorySlug },
  });

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const limit = listQuery.pagination.limit ?? 20;
  const page = listQuery.pagination.page ?? 1;
  const offset = Math.max(0, (page - 1) * limit);

  const result = await apiServer.subcategory.getMany({
    query: {
      search: listQuery.search.q,
      visibility: listQuery.filters.visibility,
      isFeatured: listQuery.filters.isFeatured,
      deleted: listQuery.filters.deleted,
      categorySlug,
      limit,
      offset,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={`${slugToTitle(categorySlug)} – Subcategories`}
            description="Manage subcategories for this category in a detailed table view"
            action="Add Subcategory"
            actionUrl={PATH.STUDIO.SUB_CATEGORIES.NEW(String(categoryResult?.data?.id ?? ""), categorySlug) as Route}
          >
            <SubcategoryTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
