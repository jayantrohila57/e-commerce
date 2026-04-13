import { apiServer } from "@/core/api/api.server";
import { AccountSection } from "@/module/account/account-section";
import { ShipmentList } from "@/module/shipment/components/shipment-list";
import type { Shipment } from "@/module/shipment/shipment.schema";

export const metadata = {
  title: "Your Shipments",
  description: "Track your order shipments",
};

export default async function ShipmentPage() {
  const shipmentsRes = await apiServer.shipment.getForCustomer({});
  const allShipments: Shipment[] = Array.isArray(shipmentsRes?.data) ? shipmentsRes.data : [];

  allShipments.sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
    const db = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
    return db - da;
  });

  return (
    <AccountSection {...metadata}>
      <ShipmentList shipments={allShipments} />
    </AccountSection>
  );
}
