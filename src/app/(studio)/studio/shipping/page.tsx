import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import ShipmentTable from "@/module/shipment/shipment.table";
import {
  ShippingMethodTable,
  ShippingProviderTable,
  ShippingRateRuleTable,
  ShippingZoneTable,
} from "@/module/shipping-config/shipping-config.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Shipping",
  description: "Manage shipments and fulfillment",
};

export default async function StudioShippingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const view = typeof input.view === "string" ? input.view : "shipments";
  const listQuery = getListQueryFromSearchParams(input);
  const status =
    typeof input.status === "string"
      ? (input.status as
          | "pending"
          | "label_created"
          | "picked_up"
          | "in_transit"
          | "out_for_delivery"
          | "delivered"
          | "exception"
          | "returned")
      : undefined;
  const carrier = typeof input.carrier === "string" ? input.carrier : undefined;
  const orderId = typeof input.orderId === "string" ? input.orderId : undefined;
  const shippingProviderId = typeof input.shippingProviderId === "string" ? input.shippingProviderId : undefined;
  const shippingMethodId = typeof input.shippingMethodId === "string" ? input.shippingMethodId : undefined;

  const [shipments, providers, methods, zones, rates] = await Promise.all([
    apiServer.shipment.getMany({
      query: {
        page: listQuery.pagination.page,
        limit: listQuery.pagination.limit,
        sortBy: "createdAt",
        sortOrder: "desc",
        status,
        carrier,
        orderId,
        shippingProviderId,
        shippingMethodId,
      },
    }),
    apiServer.shippingConfig.listProviders({}),
    apiServer.shippingConfig.listMethods({}),
    apiServer.shippingConfig.listZones({}),
    apiServer.shippingConfig.listRateRules({}),
  ]);

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            {view === "providers" && <ShippingProviderTable data={providers} />}
            {view === "methods" && <ShippingMethodTable data={methods} />}
            {view === "zones" && <ShippingZoneTable data={zones} />}
            {view === "rates" && <ShippingRateRuleTable data={rates} />}
            {view === "shipments" && <ShipmentTable data={shipments} providers={providers} methods={methods} />}
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
