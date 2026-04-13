import { AccountSection } from "@/module/account/account-section";
import { OrderList } from "@/module/order/components/order-list";

export const metadata = {
  title: "Orders",
  description: "View and track your orders",
};

export default async function OrderPage() {
  return (
    <AccountSection {...metadata}>
      <OrderList />
    </AccountSection>
  );
}
