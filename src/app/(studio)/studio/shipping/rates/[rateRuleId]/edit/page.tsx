import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingRateRuleForm } from "@/module/shipping-config/shipping-rate-rule-form";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";

interface PageProps {
  params: Promise<{
    rateRuleId: string;
  }>;
}

export default async function EditShippingRateRulePage({ params }: PageProps) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) {
    redirect(PATH.SITE.FORBIDDEN);
  }

  const { rateRuleId } = await params;

  const [ratesRes, methodsRes, zonesRes] = await Promise.all([
    apiServer.shippingConfig.listRateRules({}),
    apiServer.shippingConfig.listMethods({}),
    apiServer.shippingConfig.listZones({}),
  ]);

  const rateRule = ratesRes.data?.find((r) => r.id === rateRuleId) ?? null;
  if (!rateRule) {
    notFound();
  }

  const metadata = {
    title: "Edit Shipping Rate",
    description: "Edit shipping rate rule",
  };

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ShippingRateRuleForm
              mode="edit"
              rateRuleId={rateRuleId}
              initialData={rateRule}
              methods={methodsRes.data ?? []}
              zones={zonesRes.data ?? []}
            />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
