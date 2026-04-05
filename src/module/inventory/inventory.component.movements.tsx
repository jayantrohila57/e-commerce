"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

type InventoryMovement = {
  id: string;
  inventoryId: string;
  warehouseId?: string | null;
  variantId?: string | null;
  type: string;
  quantityBefore?: number | null;
  quantityDelta: number;
  quantityAfter?: number | null;
  incomingBefore?: number | null;
  incomingDelta: number;
  incomingAfter?: number | null;
  reservedBefore?: number | null;
  reservedDelta: number;
  reservedAfter?: number | null;
  orderId?: string | null;
  refundId?: string | null;
  reason?: string | null;
  adjustedBy?: string | null;
  createdAt: Date | string;
};

export function InventoryMovements({ movements }: { movements: InventoryMovement[] }) {
  if (!movements.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Stock Movement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No stock movements recorded for this inventory yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Stock Movement</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-80 w-full">
          <ul className="divide-border divide-y">
            {movements.map((movement) => {
              const createdAt =
                movement.createdAt instanceof Date ? movement.createdAt : new Date(String(movement.createdAt));

              const quantityLabel =
                movement.quantityDelta > 0 ? `+${movement.quantityDelta}` : String(movement.quantityDelta);

              const incomingLabel =
                movement.incomingDelta > 0 ? `+${movement.incomingDelta}` : String(movement.incomingDelta);

              const reservedLabel =
                movement.reservedDelta > 0 ? `+${movement.reservedDelta}` : String(movement.reservedDelta);

              return (
                <li key={movement.id} className="flex items-start justify-between gap-3 px-4 py-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] capitalize">
                        {movement.type}
                      </Badge>
                      {movement.reason && (
                        <span className="text-muted-foreground truncate text-[11px]">{movement.reason}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground font-mono">
                        Qty: {movement.quantityBefore ?? 0} → {movement.quantityAfter ?? 0} ({quantityLabel})
                      </span>
                      <span className="text-muted-foreground font-mono">
                        Incoming: {movement.incomingBefore ?? 0} → {movement.incomingAfter ?? 0} ({incomingLabel})
                      </span>
                      <span className="text-muted-foreground font-mono">
                        Reserved: {movement.reservedBefore ?? 0} → {movement.reservedAfter ?? 0} ({reservedLabel})
                      </span>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-[11px] whitespace-nowrap">
                    {createdAt.toLocaleString()}
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default InventoryMovements;
