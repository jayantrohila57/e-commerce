"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order } from "@/module/order/order.schema";
import { ShipmentForm } from "@/module/shipment/components/shipment-form";
import { ShipmentStatusForm } from "@/module/shipment/components/shipment-status-form";
import { ShipmentTimeline } from "@/module/shipment/components/shipment-timeline";
import type { Shipment } from "@/module/shipment/shipment.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

interface OrderShipmentSectionProps {
  order: Order;
  shipments: Shipment[];
}

export function OrderShipmentSection({ order, shipments }: OrderShipmentSectionProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [statusFormId, setStatusFormId] = useState<string | null>(null);
  const canCreate = order.status === "paid" && shipments.length === 0;

  function handleCreateSuccess() {
    setCreateOpen(false);
    router.refresh();
  }

  function handleStatusSuccess() {
    setStatusFormId(null);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Shipments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {shipments.length === 0 && !canCreate && (
          <p className="text-sm text-muted-foreground">
            {order.status === "paid" ? "No shipments yet." : "Shipments will be available after payment."}
          </p>
        )}

        {canCreate && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Create Shipment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create shipment</DialogTitle>
                <DialogDescription>Add tracking and carrier details for this order.</DialogDescription>
              </DialogHeader>
              <ShipmentForm orderId={order.id} onSuccess={handleCreateSuccess} onCancel={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        )}

        {shipments.length > 0 && (
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="rounded-lg border p-3 space-y-3">
                <ShipmentTimeline shipment={shipment} />
                {statusFormId === shipment.id ? (
                  <ShipmentStatusForm
                    shipmentId={shipment.id}
                    currentStatus={shipment.status}
                    currentTrackingNumber={shipment.trackingNumber}
                    currentCarrier={shipment.carrier}
                    onSuccess={handleStatusSuccess}
                    onCancel={() => setStatusFormId(null)}
                  />
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setStatusFormId(shipment.id)}>
                    Update status
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
