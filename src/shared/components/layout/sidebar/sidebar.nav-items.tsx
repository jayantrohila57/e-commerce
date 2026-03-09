import {
  BarChart3,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  Mail,
  MessageSquare,
  Package,
  Percent,
  Settings2,
  ShoppingBag,
  Tags,
  Truck,
  Users,
} from "lucide-react";
import { useSession } from "@/core/auth/auth.client";
import { APP_ROLE, normalizeRole, roleCanAccessStudio } from "@/core/auth/auth.roles";
import { PATH } from "@/shared/config/routes";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavSection {
  title: string;
  section: NavItem[];
}

export const getMainItems = (role?: string): NavItem[] => [
  {
    title: "Marketing",
    url: PATH.STUDIO.MARKETING.ROOT,
    icon: MessageSquare,
    items: [
      { title: "Campaigns", url: PATH.STUDIO.MARKETING.CAMPAIGNS, icon: MessageSquare },
      { title: "Discounts", url: PATH.STUDIO.DISCOUNTS.ROOT, icon: DollarSign },
    ],
  },
  {
    title: "Analytics",
    url: PATH.STUDIO.ANALYTICS.ROOT,
    icon: BarChart3,
    items: [
      { title: "Sales", url: PATH.STUDIO.ANALYTICS.SALES, icon: BarChart3 },
      { title: "Customers", url: PATH.STUDIO.ANALYTICS.CUSTOMERS, icon: Users },
    ],
  },
  {
    title: "Settings",
    url: PATH.STUDIO.SETTINGS.ROOT,
    icon: Settings2,
    items: [{ title: "Account", url: PATH.STUDIO.SETTINGS.ACCOUNT.ROOT, icon: Settings2 }],
  },
];

// ---------------------------------------------

export const getDashboardItems = (role?: string): NavItem[] => [
  {
    title: "Overview",
    url: PATH.STUDIO.ROOT,
    icon: LayoutDashboard,
  },
];
export const getCatalogItems = (role?: string): NavItem[] => [
  {
    title: "Catalog",
    url: PATH.STUDIO.PRODUCTS.ROOT,
    icon: Package,
    items: [
      { title: "Products", url: PATH.STUDIO.PRODUCTS.ROOT, icon: Package },
      { title: "Categories", url: PATH.STUDIO.CATEGORIES.ROOT, icon: Package },
      { title: "Attributes", url: PATH.STUDIO.ATTRIBUTES.ROOT, icon: Tags },
    ],
  },
];
export const getOrdersItems = (role?: string): NavItem[] => [
  {
    title: "Orders",
    url: PATH.STUDIO.ORDERS.ROOT,
    icon: ShoppingBag,
    items: [
      { title: "All Orders", url: PATH.STUDIO.ORDERS.ROOT, icon: ShoppingBag },
      { title: "Returns", url: PATH.STUDIO.SHIPPING.ROOT, icon: Truck },
      { title: "Refunds", url: PATH.STUDIO.PAYMENTS.ROOT, icon: CreditCard },
    ],
  },
];
export const getCustomersItems = (role?: string): NavItem[] => [
  {
    title: "Users",
    url: PATH.STUDIO.CUSTOMERS.ROOT,
    icon: Users,
    items: [
      { title: "All Users", url: PATH.STUDIO.CUSTOMERS.ROOT, icon: Users },
      { title: "Customers", url: PATH.STUDIO.CUSTOMERS.ROOT, icon: Users },
      { title: "Staff", url: PATH.STUDIO.CUSTOMERS.ROOT, icon: Users },
    ],
  },
];
export const getInventoryItems = (role?: string): NavItem[] => [
  {
    title: "Inventory",
    url: PATH.STUDIO.INVENTORY.ROOT,
    icon: Package,
    items: [
      { title: "All Inventory", url: PATH.STUDIO.INVENTORY.ROOT, icon: Package },
      { title: "Stock", url: PATH.STUDIO.PRODUCTS.ROOT, icon: Package },
      { title: "Warehouse", url: PATH.STUDIO.CATEGORIES.ROOT, icon: Package },
      { title: "Stock Movements", url: PATH.STUDIO.ATTRIBUTES.ROOT, icon: Tags },
    ],
  },
];
export const getMarketingItems = (role?: string): NavItem[] => [
  {
    title: "Marketing",
    url: PATH.STUDIO.MARKETING.ROOT,
    icon: MessageSquare,
    items: [
      { title: "All Marketing", url: PATH.STUDIO.MARKETING.ROOT, icon: MessageSquare },
      { title: "Campaigns", url: PATH.STUDIO.MARKETING.CAMPAIGNS, icon: MessageSquare },
      { title: "Newsletters", url: PATH.STUDIO.MARKETING.NEWSLETTERS.ROOT, icon: Mail },
      { title: "Discounts", url: PATH.STUDIO.DISCOUNTS.ROOT, icon: DollarSign },
      { title: "Promotions", url: PATH.STUDIO.MARKETING.PROMOTIONS.ROOT, icon: Percent },
      { title: "Coupons", url: PATH.STUDIO.MARKETING.COUPONS.ROOT, icon: Percent },
    ],
  },
  {
    title: "Analytics",
    url: PATH.STUDIO.ANALYTICS.ROOT,
    icon: BarChart3,
    items: [
      { title: "Sales", url: PATH.STUDIO.ANALYTICS.SALES, icon: BarChart3 },
      { title: "Customers", url: PATH.STUDIO.ANALYTICS.CUSTOMERS, icon: Users },
    ],
  },
];
export const getSettingsItems = (role?: string): NavItem[] => [
  {
    title: "Settings",
    url: PATH.STUDIO.SETTINGS.ROOT,
    icon: Settings2,
    items: [
      {
        title: "Account",
        url: PATH.STUDIO.SETTINGS.ACCOUNT.ROOT,
        icon: Settings2,
      },
      { title: "General", url: PATH.STUDIO.SETTINGS.GENERAL.ROOT, icon: Settings2 },
      { title: "Notifications", url: PATH.STUDIO.SETTINGS.NOTIFICATIONS.EMAIL, icon: Settings2 },
      { title: "Security", url: PATH.STUDIO.SETTINGS.SECURITY.TWO_FACTOR_AUTH, icon: Settings2 },
    ],
  },
];
export const getPaymentsItems = (role?: string): NavItem[] => [
  {
    title: "Payments",
    url: PATH.STUDIO.PAYMENTS.ROOT,
    icon: CreditCard,
    items: [
      { title: "All Payments", url: PATH.STUDIO.PAYMENTS.ROOT, icon: CreditCard },
      { title: "Transactions", url: PATH.STUDIO.PAYMENTS.ROOT, icon: CreditCard },
      { title: "Refunds", url: PATH.STUDIO.PAYMENTS.ROOT, icon: CreditCard },
      { title: "Payouts", url: PATH.STUDIO.PAYMENTS.ROOT, icon: CreditCard },
    ],
  },
];
export const getShippingItems = (role?: string): NavItem[] => [
  {
    title: "Shipping",
    url: PATH.STUDIO.SHIPPING.ROOT,
    icon: Truck,
    items: [
      { title: "All Shipping", url: PATH.STUDIO.SHIPPING.ROOT, icon: Truck },
      { title: "Zones", url: PATH.STUDIO.SHIPPING.ROOT, icon: Truck },
      { title: "Methods", url: PATH.STUDIO.SHIPPING.ROOT, icon: Truck },
      { title: "Rates", url: PATH.STUDIO.SHIPPING.ROOT, icon: Truck },
    ],
  },
];
export const getAnalyticsItems = (role?: string): NavItem[] => [];
export const getSupportItems = (role?: string): NavItem[] => [
  {
    title: "Support",
    url: PATH.SITE.SUPPORT.ROOT,
    icon: LifeBuoy,
    items: [
      { title: "Contact Support", url: PATH.SITE.SUPPORT.CONTACT, icon: LifeBuoy },
      { title: "FAQ", url: PATH.SITE.SUPPORT.FAQ, icon: LifeBuoy },
      { title: "Help Center", url: PATH.SITE.SUPPORT.HELP_CENTER, icon: LifeBuoy },
      { title: "Tickets", url: PATH.SITE.SUPPORT.TICKETS.ROOT, icon: LifeBuoy },
    ],
  },
  {
    title: "Feedback",
    url: PATH.SITE.SUPPORT.CONTACT,
    icon: LifeBuoy,
  },
];

export function useSidebarSections(): NavSection[] {
  const session = useSession();
  const role = normalizeRole(session.data?.user?.role);
  const canSeeStudio = roleCanAccessStudio(role);

  if (!canSeeStudio) {
    return [];
  }

  return [
    { title: "Dashboard", section: getDashboardItems(role) },
    {
      title: "Studio",
      section: [
        getCatalogItems(role),
        getOrdersItems(role),
        getPaymentsItems(role),
        getCustomersItems(role),
        getInventoryItems(role),
        getShippingItems(role),
      ].flat(),
    },
    {
      title: "Analytics & Marketing",
      section: [getAnalyticsItems(role), getMarketingItems(role)].flat(),
    },
    { title: "Help & Support", section: [getSupportItems(role), getSettingsItems(role)].flat() },
  ];
}
