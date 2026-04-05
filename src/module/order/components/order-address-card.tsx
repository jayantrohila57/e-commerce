import type { Order } from "@/module/order/order.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface OrderAddressCardProps {
  order: Order;
}

export function OrderAddressCard({ order }: OrderAddressCardProps) {
  const shipping = order.shippingAddress;
  const billing = order.billingAddress ?? order.shippingAddress;

  const renderAddress = (kind: "Shipping" | "Billing") => {
    const address = kind === "Shipping" ? shipping : billing;
    if (!address) return <p className="text-sm text-muted-foreground">No {kind.toLowerCase()} address.</p>;

    return (
      <div className="space-y-1 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{address.fullName || `${kind} recipient`}</p>
        <p>
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}
        </p>
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
        {address.phone && <p>Phone: {address.phone}</p>}
        <Button variant="outline" size="xs" className="mt-2">
          Edit {kind.toLowerCase()}
        </Button>
      </div>
    );
  };

  return (
    <Card className="bg-transparent border-none border-r rounded-none border-b">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-semibold">Addresses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 py-3 text-sm md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipping address</h3>
          {renderAddress("Shipping")}
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Billing address</h3>
          {renderAddress("Billing")}
        </div>
      </CardContent>
    </Card>
  );
}
