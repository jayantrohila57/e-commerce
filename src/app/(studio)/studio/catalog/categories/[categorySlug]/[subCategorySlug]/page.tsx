import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import ProductTable from "@/module/product/product.table";
import { SubCategoryPreviewCard } from "@/module/subcategory/subcategory-preview";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function SubCategoryPage({
  params,
  searchParams,
}: PageProps<"/studio/catalog/categories/[categorySlug]/[subCategorySlug]">) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { categorySlug: slug, subCategorySlug: sub } = await params;
  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const status =
    typeof input.status === "string" && ["draft", "archive", "live"].includes(input.status)
      ? (input.status as "draft" | "archive" | "live")
      : undefined;

  const { data } = await apiServer.subcategory.getBySlug({
    params: {
      slug: sub,
      categorySlug: slug,
    },
  });

  const result = await apiServer.product.getMany({
    query: {
      offset: listQuery.pagination.offset,
      limit: listQuery.pagination.limit,
      search: listQuery.search.q,
      categorySlug: slug,
      subcategorySlug: sub,
      status,
      deleted: listQuery.filters.deleted,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(sub)}
            description={`${site.name} · Products in this subcategory.`}
            action="Add Product"
            actionUrl={PATH.STUDIO.PRODUCTS.NEW as Route}
          >
            <div className="grid h-full w-full grid-cols-6 gap-2">
              <div className="col-span-6 h-full w-full rounded-md">
                {data && <SubCategoryPreviewCard data={data.subcategoryData} />}
              </div>
              <div className="col-span-6 h-full w-full rounded-md">
                <Separator className="my-2" />
                <ProductTable data={result} />
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
