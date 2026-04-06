import {
  CreditCard,
  Heart,
  KeyRound,
  MapPin,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  User,
  UserCog,
} from "lucide-react";
import { PATH } from "@/shared/config/routes";
import { ContentStack } from "./account.stack";

export const accountSections = {
  user: [
    {
      id: "user",
      name: "User",
      icon: UserCog,
      sections: [
        {
          name: "Profile",
          description: "View and edit your personal information and avatar.",
          icon: User,
          link: PATH.ACCOUNT.PROFILE,
        },
        {
          name: "Security",
          description: "Manage passwords, two-factor auth, and connected devices.",
          icon: Shield,
          link: PATH.ACCOUNT.SECURITY,
        },
        {
          name: "Sessions",
          description: "View and revoke active login sessions across devices.",
          icon: KeyRound,
          link: PATH.ACCOUNT.SESSIONS,
        },
        {
          name: "Settings",
          description: "Adjust preferences, themes, and account-wide configurations.",
          icon: Settings,
          link: PATH.ACCOUNT.SETTINGS,
        },
        {
          name: "Privacy",
          description: "Manage cookie consent and saved privacy preferences across devices.",
          icon: Shield,
          link: PATH.ACCOUNT.PRIVACY,
        },
      ],
    },
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
          name: "Payments",
          description: "View payment statuses and receipts for your orders.",
          icon: CreditCard,
          link: PATH.ACCOUNT.PAYMENT,
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

export default function AccountUserComponent() {
  return <ContentStack data={accountSections.user} />;
}
