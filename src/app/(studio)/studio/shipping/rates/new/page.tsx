import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingRateRuleForm } from "@/module/shipping-config/shipping-rate-rule-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "New Shipping Rate",
  description: "Create a new shipping rate rule",
};

export default async function NewShippingRateRulePage() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const [methodsRes, zonesRes] = await Promise.all([
    apiServer.shippingConfig.listMethods({}),
    apiServer.shippingConfig.listZones({}),
  ]);

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ShippingRateRuleForm mode="create" methods={methodsRes.data ?? []} zones={zonesRes.data ?? []} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
