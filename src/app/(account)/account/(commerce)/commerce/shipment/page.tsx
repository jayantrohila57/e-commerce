import { redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import { ShipmentList } from "@/module/shipment/components/shipment-list";
import type { Shipment } from "@/module/shipment/shipment.schema";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Your Shipments",
  description: "Track your order shipments",
};

export default async function ShipmentPage() {
  const session = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const ordersRes = await apiServer.order.getMany({});
  const orders = ordersRes?.data ?? [];
  const orderIds = Array.isArray(orders) ? orders.map((o) => o.id) : [];

  const allShipments: Shipment[] = [];

  for (const orderId of orderIds) {
    const shipRes = await apiServer.shipment.getByOrder({ params: { orderId } });
    const list = shipRes?.data ?? [];
    if (Array.isArray(list)) allShipments.push(...list);
  }

  allShipments.sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
    const db = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
    return db - da;
  });

  return (
    <Section   {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden lg:block h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 lg:col-span-10">
          <Card>
            <CardHeader>
              <CardTitle>Your Shipments</CardTitle>
              <CardDescription>Track your order shipments and delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <ShipmentList shipments={allShipments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
