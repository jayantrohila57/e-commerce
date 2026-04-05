import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingRateRuleTable } from "@/module/shipping-config/shipping-config.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Shipping Rates",
  description: "Manage shipping rate rules",
};

export default async function ShippingRatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const rates = await apiServer.shippingConfig.listRateRules({
    query: {
      offset: listQuery.pagination.offset,
      limit: listQuery.pagination.limit,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={metadata.title}
            description={metadata.description}
            action="Add Rate"
            actionUrl={PATH.STUDIO.SHIPPING.RATES_NEW as Route}
          >
            <ShippingRateRuleTable data={rates} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
