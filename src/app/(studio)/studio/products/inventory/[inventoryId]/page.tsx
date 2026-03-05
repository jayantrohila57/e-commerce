import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import InventoryDelete from "@/module/inventory/inventory.component.delete";
import InventoryViewCard from "@/module/inventory/inventory.component.view";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export default async function InventoryPage({ params }: PageProps<"/studio/products/inventory/[inventoryId]">) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { inventoryId } = await params;

  const { data } = await apiServer.inventory.get({ params: { id: String(inventoryId) } });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={data?.sku ?? "Inventory Item"}
            description="View and manage this inventory item"
            action="Edit Inventory"
            actionUrl={PATH.STUDIO.INVENTORY.EDIT(String(inventoryId)) as Route}
          >
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-4">{data && data && <InventoryViewCard data={data} />}</div>
              <div className="col-span-2 flex flex-col gap-2">
                {/* action controls */}
                {data && <InventoryDelete inventoryId={String(inventoryId)} />}
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
