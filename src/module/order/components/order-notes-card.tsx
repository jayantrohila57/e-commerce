import type { Order } from "@/module/order/order.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface OrderNotesCardProps {
  order: Order;
}

export function OrderNotesCard({ order }: OrderNotesCardProps) {
  const notes = order.notes;

  return (
    <Card className="bg-transparent border-none border-r rounded-none border-b">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b">
        <CardTitle className="text-sm font-semibold">Internal notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-3 text-sm">
        <p className="whitespace-pre-wrap text-xs text-muted-foreground">
          {notes?.trim() || "No internal notes for this order yet."}
        </p>
        <Button size="sm" variant="outline">
          Add note
        </Button>
      </CardContent>
    </Card>
  );
}
