import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import InventoryTable from "@/module/inventory/inventory.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Inventory",
  description: "Inventory Description",
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const stockStatus =
    typeof input.stockStatus === "string" && ["in_stock", "low_stock", "out_of_stock"].includes(input.stockStatus)
      ? (input.stockStatus as "in_stock" | "low_stock" | "out_of_stock")
      : undefined;
  const hasReservedParam = typeof input.hasReserved === "string" ? input.hasReserved : undefined;
  const hasReserved = hasReservedParam === "true" ? true : hasReservedParam === "false" ? false : undefined;
  const hasIncomingParam = typeof input.hasIncoming === "string" ? input.hasIncoming : undefined;
  const hasIncoming = hasIncomingParam === "true" ? true : hasIncomingParam === "false" ? false : undefined;

  const result = await apiServer.inventory.getMany({
    query: {
      offset: listQuery.pagination.offset,
      limit: listQuery.pagination.limit,
      search: listQuery.search.q,
      stockStatus,
      hasReserved,
      hasIncoming,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata} action="Add Inventory" actionUrl={PATH.STUDIO.INVENTORY.NEW as Route}>
            <InventoryTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
