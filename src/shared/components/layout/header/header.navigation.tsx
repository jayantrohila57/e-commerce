"use client";

import type { Route } from "next";
import Link from "next/link";
import type * as React from "react";
import { apiClient } from "@/core/api/api.client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/shared/components/ui/navigation-menu";
import { PATH } from "@/shared/config/routes";
import { Separator } from "../../ui/separator";

export function NavigationMenuDemo() {
  const { data, isLoading } = apiClient.category.getManyWithSubcategories.useQuery({
    query: {},
  });

  const categories = data?.data ?? [];

  return (
    <NavigationMenu>
      <NavigationMenuList className="h-full p-0">
        <NavigationMenuItem className="">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.SITE.ROOT}>Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {isLoading && <li className="px-3 py-2 text-sm text-muted-foreground">Loading categories...</li>}
              {!isLoading && categories.length === 0 && (
                <li className="px-3 py-2 text-sm text-muted-foreground">No categories available.</li>
              )}
              {categories.map((category) => (
                <ListItem key={category.id} title={category.title} href={PATH.STORE.CATEGORIES.CATEGORY(category.slug)}>
                  {category.description ?? ""}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.STORE.ROOT}>Store</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.SITE.ABOUT}>About</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.SITE.CONTACT}>Contact</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.SITE.SUPPORT.ROOT}>Support</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href as Route}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
