import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import { CartItemList } from "@/module/cart/components/cart-item-list";
import { CartSummary } from "@/module/cart/components/cart-summary";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Cart",
  description: "View and manage your shopping cart items",
};

export default async function CartPage() {
  return (
    <Section className="bg-muted p-4" {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden lg:block h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 lg:col-span-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="h-full w-full border-none ">
              
              <CardContent className="p-0 sm:p-6   backdrop-blur-sm">
                <CartItemList />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      </div>
    </Section>
  );
}
