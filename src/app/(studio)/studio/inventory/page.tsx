import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import InventoryMovements from "@/module/inventory/inventory.component.movements";
import InventoryTable from "@/module/inventory/inventory.table";
import type { InventoryMovement } from "@/module/inventory/inventory.types";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: `${site.name} Inventory`,
  description: `${site.name} inventory management.`,
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
  const view = typeof input.view === "string" ? input.view : "stock";
  const listQuery = getListQueryFromSearchParams(input);

  const stockStatus =
    typeof input.stockStatus === "string" && ["in_stock", "low_stock", "out_of_stock"].includes(input.stockStatus)
      ? (input.stockStatus as "in_stock" | "low_stock" | "out_of_stock")
      : undefined;
  const hasReservedParam = typeof input.hasReserved === "string" ? input.hasReserved : undefined;
  const hasReserved = hasReservedParam === "true" ? true : hasReservedParam === "false" ? false : undefined;
  const hasIncomingParam = typeof input.hasIncoming === "string" ? input.hasIncoming : undefined;
  const hasIncoming = hasIncomingParam === "true" ? true : hasIncomingParam === "false" ? false : undefined;

  const warehousePresenceParam = typeof input.warehousePresence === "string" ? input.warehousePresence : undefined;
  const warehousePresence =
    warehousePresenceParam === "assigned" || warehousePresenceParam === "unassigned"
      ? warehousePresenceParam
      : undefined;

  const warehouseId = typeof input.warehouseId === "string" ? input.warehouseId : undefined;

  const result = await apiServer.inventory.getMany({
    query: {
      offset: listQuery.pagination.offset,
      limit: listQuery.pagination.limit,
      search: listQuery.search.q,
      stockStatus,
      hasReserved,
      hasIncoming,
      warehousePresence,
      warehouseId,
    },
  });

  let movements: InventoryMovement[] = [];

  if (view === "movements" && Array.isArray(result.data) && result.data.length > 0) {
    const movementResponses = await Promise.all(
      result.data.map((inventory) =>
        apiServer.inventory.getMovements({
          params: { inventoryId: inventory.id },
          query: {
            limit: 10,
            offset: 0,
          },
        }),
      ),
    );

    movements = movementResponses.flatMap((response) => response.data ?? []);
  }

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata} action="Add Inventory" actionUrl={PATH.STUDIO.INVENTORY.NEW as Route}>
            {view === "movements" ? <InventoryMovements movements={movements} /> : <InventoryTable data={result} />}
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
