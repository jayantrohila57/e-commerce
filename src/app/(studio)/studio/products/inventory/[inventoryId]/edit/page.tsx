import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import InventoryEditForm from "@/module/inventory/inventory.component.edit-form";
import InventoryViewCard from "@/module/inventory/inventory.component.view";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { redirect } from "next/navigation";

export default async function InventoryEditPage({
  params,
}: PageProps<"/studio/products/inventory/[inventoryId]/edit">) {
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const { inventoryId } = await params;

  const { data } = await apiServer.inventory.get({ params: { id: String(inventoryId) } });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection title={data?.sku ?? "Edit Inventory"} description={`Edit inventory ${String(inventoryId)}`}>
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-2">{data && <InventoryViewCard data={data} />}</div>
              <div className="col-span-4">{data && <InventoryEditForm inventory={data} />}</div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
