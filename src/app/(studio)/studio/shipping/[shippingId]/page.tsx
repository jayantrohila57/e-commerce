import { format } from "date-fns";
import type { Route } from "next";
import Link from "next/link";
import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { ShipmentStatusBadge } from "@/module/shipment/components/shipment-status-badge";
import { ShipmentTimeline } from "@/module/shipment/components/shipment-timeline";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Shipment details",
  description: "View and manage shipment",
};

interface StudioShipmentDetailPageProps {
  params: Promise<{ shippingId: string }>;
}

export default async function StudioShipmentDetailPage({ params }: StudioShipmentDetailPageProps) {
  const { shippingId: id } = await params;
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const res = await apiServer.shipment.get({ params: { id } });

  if (res.status !== "success" || !res.data) {
    return notFound();
  }

  const shipment = res.data;

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <Section {...metadata}>
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">
                  {shipment.trackingNumber
                    ? `Tracking: ${shipment.trackingNumber}`
                    : `Shipment #${shipment.id.slice(0, 8)}`}
                </h1>
                <p className="text-sm text-muted-foreground">View and update shipment status.</p>
              </div>
              <div className="flex items-center gap-2">
                <ShipmentStatusBadge status={shipment.status} />
                <Button asChild size="sm" variant="outline">
                  <Link href={PATH.STUDIO.SHIPPING.ROOT as Route}>Back to shipping</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <Link
                      href={PATH.STUDIO.ORDERS.VIEW(shipment.orderId) as Route}
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
                  {shipment.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking</span>
                      <span className="font-medium">{shipment.trackingNumber}</span>
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
                <CardContent className="pt-4">
                  <ShipmentTimeline shipment={shipment} />
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
