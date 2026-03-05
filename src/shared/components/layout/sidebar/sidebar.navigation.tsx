"use client";

import {
  BarChart3,
  ChevronRight,
  DollarSign,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  MessageSquare,
  Package,
  Settings2,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import { PATH } from "@/shared/config/routes";
import { cn } from "@/shared/utils/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { Separator } from "../../ui/separator";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
}

function useIsActive() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (url: string, strict = false) => {
    const [targetPath, targetQuery = ""] = url.split("?");

    // strict match: exact path only
    if (strict) return pathname === targetPath;

    // relaxed match: match if pathname ends with the subpath (not just prefix)
    if (!pathname.endsWith(targetPath)) return false;

    if (targetQuery) {
      const query = new URLSearchParams(targetQuery);
      for (const [key, value] of query.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
    }

    return true;
  };
}

export function NavMain() {
  const isActive = useIsActive();
  const collapsibleId = useId();

  const onboardItems: NavItem[] = [
    {
      title: "Overview",
      url: PATH.STUDIO.ROOT,
      icon: LayoutDashboard,
    },
    // { title: 'Onboarding', url: '/studio/onboarding', icon: Rocket },
  ];

  const mainItems: NavItem[] = [
    {
      title: "Products",
      url: PATH.STUDIO.PRODUCTS.ROOT,
      icon: Package,
      items: [
        { title: "All Products", url: PATH.STUDIO.PRODUCTS.ROOT, icon: Package },
        { title: "Categories", url: PATH.STUDIO.CATEGORIES.ROOT, icon: Package },
        { title: "Inventory", url: PATH.STUDIO.INVENTORY.ROOT, icon: Package },
      ],
    },
    {
      title: "Orders",
      url: PATH.STUDIO.ORDERS.ROOT,
      icon: ShoppingBag,
      items: [{ title: "All Orders", url: PATH.STUDIO.ORDERS.ROOT, icon: ShoppingBag }],
    },
    // {
    //   title: 'Customers',
    //   url: PATH.STUDIO.CUSTOMERS.ROOT,
    //   icon: Users,
    //   items: [
    //     { title: 'All Customers', url: PATH.STUDIO.CUSTOMERS.ROOT, icon: Users },
    //     { title: 'Segments', url: `${PATH.STUDIO.CUSTOMERS.ROOT}/segments`, icon: Users },
    //   ],
    // },
    // {
    //   title: 'Payments & Finance',
    //   url: PATH.STUDIO.PAYMENTS.ROOT,
    //   icon: DollarSign,
    //   items: [
    //     { title: 'Transactions', url: PATH.STUDIO.PAYMENTS.ROOT, icon: DollarSign },
    //     { title: 'Shipping', url: PATH.STUDIO.SHIPPING.ROOT, icon: Truck },
    //   ],
    // },
  ];

  const marketingItems: NavItem[] = [
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
  ];

  const setting: NavItem[] = [
    {
      title: "Settings",
      url: PATH.STUDIO.SETTINGS.ROOT,
      icon: Settings2,
      items: [
        { title: "Profile", url: PATH.STUDIO.SETTINGS.PROFILE, icon: Settings2 },
        { title: "Team", url: PATH.STUDIO.SETTINGS.TEAM, icon: Users },
      ],
    },
    {
      title: "Support",
      url: PATH.SITE.SUPPORT.ROOT,
      icon: LifeBuoy,
    },
  ];

  const sections = [
    { title: "Dashboard", section: onboardItems },
    { title: "Studio", section: mainItems },
    // { title: 'Marketing', section: marketingItems },
    // { title: 'Settings', section: setting },
  ];

  const [openStates, setOpenStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((section, sectionIndex) => {
      section.section.forEach((item, itemIndex) => {
        const itemId = `${collapsibleId}-${sectionIndex}-${itemIndex}`;
        const hasActiveChild = item.items?.some((sub) => isActive(sub.url, true)) || false;
        const isItemActive = isActive(item.url, true) || hasActiveChild;
        initial[itemId] = !!isItemActive;
      });
    });
    return initial;
  });

  return (
    <div className="bg-background h-full rounded-md border p-[2.5px]">
      {sections.map((section, sectionIndex) => (
        <SidebarGroup className="p-0" key={sectionIndex}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu key={sectionIndex}>
            {section.section.map((item, itemIndex) => {
              const hasChildren = !!item.items?.length;
              const hasActiveChild = item.items?.some((sub) => isActive(sub.url, true)) || false;
              const isItemActive = isActive(item.url, true) || hasActiveChild;
              const itemId = `${collapsibleId}-${sectionIndex}-${itemIndex}`;

              if (!hasChildren) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url as Route}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "transition-colors",
                          isItemActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-foreground/70",
                        )}
                      >
                        {item.icon && (
                          <item.icon className={cn("h-4 w-4", isItemActive ? "opacity-100" : "opacity-70")} />
                        )}
                        <span className={isItemActive ? "font-medium" : "font-normal"}>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              }

              const open = !!openStates[itemId];

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  open={open}
                  onOpenChange={(next) => setOpenStates((prev) => ({ ...prev, [itemId]: next }))}
                  id={itemId}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "group w-full transition-colors",
                          isItemActive
                            ? "bg-accent/20 text-accent-foreground"
                            : "hover:bg-accent/50 text-foreground/70",
                        )}
                      >
                        {item.icon && (
                          <item.icon className={cn("h-4 w-4", isItemActive ? "opacity-100" : "opacity-70")} />
                        )}
                        <span className={isItemActive ? "font-medium" : "font-normal"}>{item.title}</span>
                        <ChevronRight
                          className={cn("ml-auto h-4 w-4 transition-transform duration-200", open && "rotate-90")}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubItemActive = isActive(subItem.url, true);
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={subItem.url as Route}
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors",
                                    isSubItemActive
                                      ? "bg-accent text-accent-foreground font-medium"
                                      : "text-muted-foreground hover:text-foreground",
                                  )}
                                >
                                  {subItem.icon && (
                                    <subItem.icon
                                      className={cn("h-4 w-4", isSubItemActive ? "opacity-100" : "opacity-70")}
                                    />
                                  )}
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
          {<Separator className="my-2" />}
        </SidebarGroup>
      ))}
    </div>
  );
}
