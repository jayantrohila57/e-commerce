import { Badge } from "@/shared/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";
import type { Route } from "next";
import Link from "next/link";

type Inventory = {
  id: string;
  sku: string;
  barcode?: string | null;
  quantity: number;
  incoming: number;
  reserved: number;
};

export interface InventoryCardProps {
  inventory: Inventory;
  href?: string;
  className?: string;
}

export function InventoryCard({ inventory, href }: InventoryCardProps) {
  const content = (
    <div className="w-full">
      <Card className="bg-secondary w-full p-2">
        <CardHeader className="flex items-center justify-between gap-4 p-2">
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold">
              {String(inventory?.sku)?.slice(0, 2)?.toUpperCase()}
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-sm">{inventory?.sku}</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                {inventory?.barcode ?? "No barcode"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Qty: {inventory?.quantity}</Badge>
            <Badge variant="outline">Incoming: {inventory?.incoming}</Badge>
            <Badge variant="outline">Reserved: {inventory?.reserved}</Badge>
          </div>
        </CardHeader>
      </Card>
    </div>
  );

  if (href) {
    return <Link href={href as Route}>{content}</Link>;
  }

  // default link to edit page
  return <Link href={PATH.STUDIO.INVENTORY?.EDIT(inventory?.id) as Route}>{content}</Link>;
}

export default InventoryCard;
