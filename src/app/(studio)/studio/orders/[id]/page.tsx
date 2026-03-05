import type { Route } from "next";
import { notFound, redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import { OrderStatusActions } from "@/module/order/components/order-status-actions";
import { OrderDetailSection } from "@/module/order/order-detail.section";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Order details",
  description: "View and manage order details",
};

interface StudioOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudioOrderDetailPage({ params }: StudioOrderDetailPageProps) {
  const { id } = await params;
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const res = await apiServer.order?.get({
    params: { id },
  });

  if (res.status !== "success" || !res.data) {
    return notFound();
  }

  const order = res.data;

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <Section {...metadata}>
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">Order #{order?.id?.slice(0, 8)}</h1>
                <p className="text-sm text-muted-foreground">Manage the status and details of this order.</p>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusActions orderId={order?.id} status={order?.status} />
                <Button asChild size="sm" variant="outline">
                  <a href={PATH.STUDIO.ORDERS.ROOT as Route}>Back to orders</a>
                </Button>
              </div>
            </div>

            <OrderDetailSection order={order} />
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
