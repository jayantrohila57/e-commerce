import { apiServer } from "@/core/api/api.server";
import { ShipmentList } from "@/module/shipment/components/shipment-list";
import type { Shipment } from "@/module/shipment/shipment.schema";
import Section from "@/shared/components/layout/section/section";

export const metadata = {
  title: "Your Shipments",
  description: "Track your order shipments",
};

export default async function ShipmentPage() {
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
    <Section {...metadata}>
      <ShipmentList shipments={allShipments} />
    </Section>
  );
}
