import { AccountSection } from "@/module/account/account-section";
import { CartItemList } from "@/module/cart/components/cart-item-list";
import { CartSummary } from "@/module/cart/components/cart-summary";
import { Card, CardContent } from "@/shared/components/ui/card";

export const metadata = {
  title: "Cart",
  description: "View and manage your shopping cart items",
};

export default async function CartPage() {
  return (
    <AccountSection {...metadata}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <Card className="h-full w-full border-none">
            <CardContent className="p-0 backdrop-blur-sm sm:p-6">
              <CartItemList />
            </CardContent>
          </Card>
          <CartSummary />
        </div>
      </div>
    </AccountSection>
  );
}
