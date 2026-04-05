import type { Route } from "next";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShippingProviderTable } from "@/module/shipping-config/shipping-config.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Shipping Providers",
  description: "Manage shipping carriers and providers",
};

export default async function ShippingProvidersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const providers = await apiServer.shippingConfig.listProviders({
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
            action="Add Provider"
            actionUrl={PATH.STUDIO.SHIPPING.PROVIDERS_NEW as Route}
          >
            <ShippingProviderTable data={providers} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
