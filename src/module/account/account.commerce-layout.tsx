import { Heart, MapPin, Package, ShoppingBag, ShoppingCart, Star, Truck } from "lucide-react";
import { PATH } from "@/shared/config/routes";
import { ContentStack } from "./account.stack";

export const accountSections = {
  commerce: [
    {
      id: "commerce",
      name: "Commerce",
      icon: ShoppingBag,
      sections: [
        {
          name: "Cart",
          description: "View, edit, and manage items in your shopping cart.",
          icon: ShoppingCart,
          link: PATH.ACCOUNT.CART,
        },
        {
          name: "Wishlist",
          description: "Save and track your favorite products for later.",
          icon: Heart,
          link: PATH.ACCOUNT.WISHLIST,
        },
        {
          name: "Addresses",
          description: "Manage shipping and billing addresses.",
          icon: MapPin,
          link: PATH.ACCOUNT.ADDRESS,
        },
        {
          name: "Orders",
          description: "Track your order history and view invoice details.",
          icon: Package,
          link: PATH.ACCOUNT.ORDER,
        },
        {
          name: "Shipments",
          description: "Monitor your ongoing deliveries in real-time.",
          icon: Truck,
          link: PATH.ACCOUNT.SHIPMENT,
        },
        {
          name: "Reviews",
          description: "Review your past purchases and share feedback.",
          icon: Star,
          link: PATH.ACCOUNT.REVIEW,
        },
      ],
    },
  ],
};

export default function AccountCommerceComponent() {
  return <ContentStack data={accountSections.commerce} />;
}
