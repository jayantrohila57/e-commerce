import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingZoneForm } from "@/module/shipping-config/shipping-zone-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "New Shipping Zone",
  description: "Create a new shipping zone",
};

export default async function NewShippingZonePage() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ShippingZoneForm mode="create" />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
