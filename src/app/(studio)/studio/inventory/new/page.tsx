import { redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import InventoryCreateForm from "@/module/inventory/inventory.component.create-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Add Inventory",
  description: "Create a new inventory record",
};

export default async function InventoryCreatePage() {
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  // Warm up tRPC on the server so that the client form
  // has a responsive experience when submitting.
  await apiServer.inventory.getMany({ query: { limit: 1, offset: 0 } });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <InventoryCreateForm />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
