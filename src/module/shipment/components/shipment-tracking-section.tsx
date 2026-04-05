import { apiServer } from "@/core/api/api.server";
import { ShipmentList } from "@/module/shipment/components/shipment-list";
import { ShipmentTimeline } from "@/module/shipment/components/shipment-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

interface ShipmentTrackingSectionProps {
  orderId: string;
}

export async function ShipmentTrackingSection({ orderId }: ShipmentTrackingSectionProps) {
  const res = await apiServer.shipment.getByOrder({ params: { orderId } });
  const shipments = res?.data ?? [];

  if (!shipments.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Shipment tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ShipmentList shipments={shipments} orderId={orderId} baseHref={PATH.ACCOUNT.SHIPMENT} />
        {shipments.length === 1 && (
          <div className="pt-2">
            <ShipmentTimeline shipment={shipments[0]} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
