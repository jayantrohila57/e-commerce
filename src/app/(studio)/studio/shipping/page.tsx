import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import ShipmentTable from "@/module/shipment/shipment.table";
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
  const result = await apiServer.shipment.getMany({
    query: {
      page: listQuery.pagination.page,
      limit: listQuery.pagination.limit,
      sortBy: "createdAt",
      sortOrder: "desc",
      status,
      carrier,
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <ShipmentTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
