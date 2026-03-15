import { OrderList } from "@/module/order/components/order-list";
import Section from "@/shared/components/layout/section/section";

export const metadata = {
  title: "Orders",
  description: "View and track your orders",
};

export default async function OrderPage() {
  return (
    <Section {...metadata}>
      <OrderList />
    </Section>
  );
}
