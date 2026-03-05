import { notFound, redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { OrderDetailSection } from "@/module/order/order-detail.section";
import Section from "@/shared/components/layout/section/section";
import { PATH } from "@/shared/config/routes";

interface StoreOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Order details",
  description: "View details of your order",
};

export default async function StoreOrderDetailPage({ params }: StoreOrderDetailPageProps) {
  const { id } = await params;

  if (!id) {
    return redirect(PATH.STORE.ROOT);
  }

  const res = await apiServer.order.get({
    params: { id },
  });

  if (res.status !== "success" || !res.data) {
    return notFound();
  }

  const order = res.data;

  return (
    <Section className="bg-muted p-4" {...metadata}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-muted-foreground">Review the items and status for this order.</p>
        </div>

        <OrderDetailSection order={order} />
      </div>
    </Section>
  );
}
