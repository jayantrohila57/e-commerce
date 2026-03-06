"use client";

import { Info } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/lib/utils";

type Inventory = {
  id: string;
  sku: string;
  barcode?: string | null;
  quantity: number;
  incoming: number;
  reserved: number;
  updatedAt?: Date | string | null;
};

export function InventoryViewCard({ data }: { data: Inventory }) {
  return (
    <Card className={cn()}>
      <div className="relative w-full overflow-hidden">{/* future: indicator icons, reserved badges etc */}</div>

      <CardHeader className="px-4 pt-4 pb-0">
        <h3 className="text-lg leading-tight font-semibold">{data.sku}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{data.barcode ?? "No barcode"}</p>
      </CardHeader>

      <CardContent className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Quantity: {data.quantity}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Incoming: {data.incoming}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Reserved: {data.reserved}
          </Badge>
        </div>

        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Info size={14} />
          {data.updatedAt
            ? data.updatedAt instanceof Date
              ? data.updatedAt.toLocaleString()
              : new Date(String(data.updatedAt)).toLocaleString()
            : "—"}
        </div>
      </CardContent>
    </Card>
  );
}

export default InventoryViewCard;
