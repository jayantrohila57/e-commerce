import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import OrderTable from "@/module/order/order.table";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { getListQueryFromSearchParams } from "@/shared/utils/lib/list-query.utils";

export const metadata = {
  title: "Orders",
  description: "Manage customer orders",
};

export default async function StudioOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const input = await searchParams;
  const listQuery = getListQueryFromSearchParams(input);

  const statusParam = typeof input.status === "string" ? input.status : undefined;
  const customerTypeParam = typeof input.customerType === "string" ? input.customerType : undefined;

  const status =
    statusParam && ["pending", "paid", "shipped", "delivered", "cancelled"].includes(statusParam)
      ? (statusParam as "pending" | "paid" | "shipped" | "delivered" | "cancelled")
      : undefined;

  const customerType =
    customerTypeParam && ["registered", "guest"].includes(customerTypeParam) ? customerTypeParam : undefined;

  const result = await apiServer.order.getManyAdmin({
    query: {
      page: listQuery.pagination.page,
      limit: listQuery.pagination.limit,
      status,
      q: listQuery.search.q,
      customerType,
    } as unknown as {
      page?: number;
      limit?: number;
      status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
      q?: string;
      customerType?: "registered" | "guest";
    },
  });

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <OrderTable data={result} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
