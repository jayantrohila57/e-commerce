import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingZoneForm } from "@/module/shipping-config/shipping-zone-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

interface PageProps {
  params: Promise<{
    zoneId: string;
  }>;
}

export default async function EditShippingZonePage({ params }: PageProps) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { zoneId } = await params;

  const zonesRes = await apiServer.shippingConfig.listZones({});
  const zone = zonesRes.data?.find((z) => z.id === zoneId) ?? null;

  if (!zone) {
    notFound();
  }

  const metadata = {
    title: "Edit Shipping Zone",
    description: `Edit zone “${zone.name}”`,
  };

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ShippingZoneForm mode="edit" zoneId={zoneId} initialData={zone} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
