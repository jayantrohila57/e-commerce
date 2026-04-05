import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import ProductTable from "@/module/product/product.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: `${site.name} Products`,
  description: `${site.name} product catalog.`,
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const status =
    typeof input.status === "string" && ["draft", "archive", "live"].includes(input.status)
      ? (input.status as "draft" | "archive" | "live")
      : undefined;
  const categorySlug = typeof input.categorySlug === "string" ? input.categorySlug : undefined;
  const subcategorySlug = typeof input.subcategorySlug === "string" ? input.subcategorySlug : undefined;

  const result = await apiServer.product.getMany({
    query: {
      offset: listQuery.pagination.offset,
      limit: listQuery.pagination.limit,
      search: listQuery.search.q,
      categorySlug,
      subcategorySlug,
      status,
      deleted: listQuery.filters.deleted,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata} action="Add Product" actionUrl={PATH.STUDIO.PRODUCTS.NEW as Route}>
            <ProductTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
