import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import { OrderList } from "@/module/order/components/order-list";
import Section from "@/shared/components/layout/section/section";

export const metadata = {
  title: "Orders",
  description: "View and track your orders",
};
export default async function OrderPage() {
  return (
    <Section className="bg-muted p-4" {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden lg:block h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 lg:col-span-10">
          <OrderList />
        </div>
      </div>
    </Section>
  );
}
