import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { DiscountTable } from "@/module/discount/discount.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Discounts",
  description: "Manage discounts and coupon codes",
};

export default async function StudioDiscountsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const isActiveParam = typeof input.isActive === "string" ? input.isActive : undefined;
  const isActive = isActiveParam && ["true", "false"].includes(isActiveParam) ? isActiveParam === "true" : undefined;

  const result = await apiServer.discount.list({
    query: {
      limit: listQuery.pagination.limit,
      offset: (listQuery.pagination.page - 1) * listQuery.pagination.limit,
      code: listQuery.search.q || undefined,
      isActive,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <DiscountTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
