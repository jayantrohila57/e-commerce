import type { Route } from "next";
import Link from "next/link";
import { forbidden, notFound, redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import type { Payment } from "@/module/payment";
import { PaymentMetadataCard } from "@/module/payment/components/payment-metadata-card";
import { PaymentOverviewCard } from "@/module/payment/components/payment-overview-card";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Payment details",
  description: "View payment transaction details",
};

interface StudioPaymentDetailPageProps {
  params: Promise<{
    paymentId: string;
  }>;
}

export default async function StudioPaymentDetailPage({ params }: StudioPaymentDetailPageProps) {
  const { paymentId } = await params;
  const { session, user } = await getServerSession();

  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const res = await apiServer.payment.get({
    params: { id: paymentId },
  });

  if (res.status !== "success" || !res.data) {
    return notFound();
  }

  const payment = res.data as Payment;

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <Section {...metadata}>
          <div className="flex flex-col gap-4">
            <PaymentOverviewCard payment={payment} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <PaymentMetadataCard payment={payment} />
              </div>
              <div className="space-y-4">
                <Card className="bg-transparent">
                  <CardHeader className="border-b">
                    <CardTitle className="text-sm font-semibold">Linked order</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 text-sm text-muted-foreground">
                    This payment is linked to{" "}
                    <Link
                      href={PATH.STUDIO.ORDERS.VIEW(payment.orderId) as Route}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Order #{payment.orderId.slice(0, 8)}
                    </Link>
                    . Use the order detail page to see full information.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
