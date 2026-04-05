import { format } from "date-fns";
import type { Route } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { ShipmentStatusBadge } from "@/module/shipment/components/shipment-status-badge";
import { ShipmentTimeline } from "@/module/shipment/components/shipment-timeline";
import Section from "@/shared/components/layout/section/section";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Shipment details",
  description: "Track shipment status and delivery progress",
};

interface AccountShipmentDetailPageProps {
  params: Promise<{ id: string }>;
}

function buildTrackingUrl(carrier: string | null | undefined, trackingNumber: string | null | undefined) {
  if (!trackingNumber) return null;

  const query = encodeURIComponent(trackingNumber);
  const carrierName = carrier?.toLowerCase() ?? "";

  if (carrierName.includes("dhl"))
    return `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${query}`;
  if (carrierName.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${query}`;
  if (carrierName.includes("delhivery")) return `https://www.delhivery.com/track-v2/package/${query}`;

  return `https://www.google.com/search?q=${encodeURIComponent(`track ${carrier ?? "shipment"} ${trackingNumber}`)}`;
}

export default async function AccountShipmentDetailPage({ params }: AccountShipmentDetailPageProps) {
  const { id } = await params;
  if (!id) return redirect(PATH.ACCOUNT.SHIPMENT);

  const shipmentsRes = await apiServer.shipment.getForCustomer({});
  const shipments = Array.isArray(shipmentsRes.data) ? shipmentsRes.data : [];
  const shipment = shipments.find((item) => item.id === id);

  if (!shipment) return notFound();

  const trackingUrl = buildTrackingUrl(shipment.carrier, shipment.trackingNumber);

  return (
    <Section {...metadata}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">
              {shipment.trackingNumber
                ? `Tracking: ${shipment.trackingNumber}`
                : `Shipment #${shipment.id.slice(0, 8)}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              Follow your package progress with the latest status updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShipmentStatusBadge status={shipment.status} />
            <Button asChild size="sm" variant="outline">
              <Link href={PATH.ACCOUNT.SHIPMENT as Route}>Back to shipments</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Shipment details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order</span>
                <Link
                  href={PATH.ACCOUNT.ORDER_DETAIL(shipment.orderId) as Route}
                  className="font-medium hover:underline"
                >
                  #{shipment.orderId.slice(0, 8)}
                </Link>
              </div>
              {shipment.carrier && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-medium">{shipment.carrier}</span>
                </div>
              )}
              {shipment.shippingProviderName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium">{shipment.shippingProviderName}</span>
                </div>
              )}
              {shipment.shippingMethodName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{shipment.shippingMethodName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{shipment.createdAt ? format(new Date(shipment.createdAt), "dd MMM yyyy, HH:mm") : "—"}</span>
              </div>
              {shipment.shippedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipped</span>
                  <span>{format(new Date(shipment.shippedAt), "dd MMM yyyy")}</span>
                </div>
              )}
              {shipment.deliveredAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivered</span>
                  <span>{format(new Date(shipment.deliveredAt), "dd MMM yyyy")}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tracking progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <ShipmentTimeline shipment={shipment} />
              <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href={PATH.ACCOUNT.ORDER_DETAIL(shipment.orderId) as Route}>View order</Link>
                </Button>
                {trackingUrl && (
                  <Button asChild size="sm">
                    <Link href={trackingUrl as Route} target="_blank" rel="noreferrer noopener">
                      Track package
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
