import { WishlistItemList } from "@/module/wishlist/components/wishlist-item-list";
import { WishlistSummary } from "@/module/wishlist/components/wishlist-summary";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Wishlist",
  description: "View and manage your saved items",
};

export default async function WishlistPage() {
  return (
    <Section {...metadata}>
      <div className="lg:col-span-12">
        <Card className="h-full w-full border-none">
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
            <CardDescription>Products you have saved for later</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 backdrop-blur-sm">
            <WishlistItemList />
          </CardContent>
        </Card>
        <WishlistSummary />
      </div>
    </Section>
  );
}
