import { redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import { OrdersSection } from "@/module/order/order-section";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Orders",
  description: "Manage customer orders",
};

export default async function StudioOrdersPage() {
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const { data } = await apiServer.order.getMany({
    query: {},
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <OrdersSection orders={data} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
