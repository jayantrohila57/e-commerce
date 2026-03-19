import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { WarehouseForm } from "@/module/inventory/warehouse-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

interface PageProps {
  params: Promise<{
    warehouseId: string;
  }>;
}

export default async function EditWarehousePage({ params }: PageProps) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { warehouseId } = await params;

  const res = await apiServer.warehouse.get({
    params: { id: warehouseId },
  });

  const warehouse = res.data;
  if (!warehouse) {
    notFound();
  }

  const metadata = {
    title: "Edit Warehouse",
    description: `Edit warehouse “${warehouse.name}”`,
  };

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <WarehouseForm mode="edit" warehouseId={warehouseId} initialData={warehouse} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
