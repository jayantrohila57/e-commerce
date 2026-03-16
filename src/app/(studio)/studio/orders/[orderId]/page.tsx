import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { OrderAddressCard } from "@/module/order/components/order-address-card";
import { OrderCustomerCard } from "@/module/order/components/order-customer-card";
import { OrderItemList } from "@/module/order/components/order-item-list";
import { OrderNotesCard } from "@/module/order/components/order-notes-card";
import { OrderOverviewCard } from "@/module/order/components/order-overview-card";
import { OrderPaymentCard } from "@/module/order/components/order-payment-card";
import { OrderSummary } from "@/module/order/components/order-summary";
import { OrderTimeline } from "@/module/order/components/order-timeline";
import { OrderShipmentSection } from "@/module/shipment/components/order-shipment-section";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Order details",
  description: "View and manage order details",
};

interface StudioOrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function StudioOrderDetailPage({ params }: StudioOrderDetailPageProps) {
  const { orderId: id } = await params;
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const res = await apiServer.order?.get({
    params: { id },
  });

  if (res.status !== "success" || !res.data) {
    return notFound();
  }

  const order = res.data;
  const shipRes = await apiServer.shipment.getByOrder({ params: { orderId: id } });
  const shipments = shipRes?.data ?? [];

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <Section {...metadata}>
          <div className="flex flex-col">
            <OrderOverviewCard order={order} />
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
              <Card className="bg-transparent border-none border-r rounded-none border-b">
                  <CardHeader className="border-b">
                    <CardTitle className="text-sm font-semibold">
                      Order items <span className="text-xs text-muted-foreground">({order.items?.length ?? 0})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <OrderItemList order={order} />
                  </CardContent>
                </Card>
                <Card className="bg-transparent border-none border-r rounded-none border-b">
                  <CardHeader className="border-b">
                    <CardTitle className="text-sm font-semibold">Order status timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <OrderTimeline order={order} />
                  </CardContent>
                </Card>
                <OrderPaymentCard order={order} />
                <OrderShipmentSection order={order} shipments={Array.isArray(shipments) ? shipments : []} />
                <OrderNotesCard order={order} />
              </div>
              <div>
                <OrderSummary order={order} />

                <OrderCustomerCard order={order} />
                <OrderAddressCard order={order} />
              </div>
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
