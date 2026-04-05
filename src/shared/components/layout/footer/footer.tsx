import type { Route } from "next";
import Link from "next/link";
import { Icons } from "@/shared/components/common/icons";
import RSS from "@/shared/components/common/rss";
import Social from "@/shared/components/common/social";
import { ThemeToggle } from "@/shared/components/theme/theme-toggle";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { AppBrand } from "../section/auth.card-layout";

type NavItem<T extends string = string> = {
  href: T;
  title: string;
  newTab: boolean;
};

interface NavType {
  title: string;
  submenu: NavItem<Route>[];
}

export const footer: NavType[] = [
  {
    title: "Shop",
    submenu: [
      { title: "New Arrivals", href: "/store/new" as Route, newTab: false },
      { title: "Best Sellers", href: "/store/best-sellers" as Route, newTab: false },
      { title: "Sale", href: "/store/sale" as Route, newTab: false },
      { title: "Gift Cards", href: "/store/gift-cards" as Route, newTab: false },
      { title: "All Products", href: "/store" as Route, newTab: false },
    ],
  },
  {
    title: "Customer Care",
    submenu: [
      { title: "Track Order", href: "/orders/track" as Route, newTab: false },
      { title: "Shipping Info", href: "/support/shipping" as Route, newTab: false },
      { title: "Returns & Exchanges", href: "/support/returns" as Route, newTab: false },
      { title: "Size Guide", href: "/support/size-guide" as Route, newTab: false },
      { title: "Contact Support", href: "/support/contact" as Route, newTab: false },
    ],
  },
  {
    title: "Legal",
    submenu: [
      { title: "Privacy Policy", href: "/legal/privacy-policy" as Route, newTab: false },
      { title: "Terms of Service", href: "/legal/terms-of-service" as Route, newTab: false },
      { title: "Refund Policy", href: "/legal/refund-policy" as Route, newTab: false },
      { title: "Cookies Settings", href: "/legal/cookies-policy" as Route, newTab: false },
    ],
  },
  {
    title: "Connect",
    submenu: [
      { title: "Instagram", href: "https://instagram.com/yourstore" as Route, newTab: true },
      { title: "Twitter", href: "https://twitter.com/yourstore" as Route, newTab: true },
      { title: "Facebook", href: "https://facebook.com/yourstore" as Route, newTab: true },
      { title: "Newsletter", href: "/newsletter" as Route, newTab: false },
    ],
  },
];

export default function Footer() {
  return (
    <div className="h-full w-full  mt-16 items-center border-r border-t justify-between">
      <div className="h-full w-full flex-row">
        <div className="relative flex border-b h-full w-full flex-col-reverse justify-between md:flex-row">
          <div className="z-10 flex max-w-2xl p-4 border-r flex-col justify-between sm:flex-row md:max-w-xl md:flex-col">
            <div className="w-full">
              <Link href={PATH.ROOT}>
                <div className="flex flex-row items-start justify-start gap-1">
                  <div className="mt-1 text-2xl font-medium">{site.name}</div>
                </div>
              </Link>
              <p className="text-muted-foreground pb-5 text-sm leading-tight">{site.description}</p>
              <p className="pb-1 text-sm">
                <span className="text-muted-foreground pr-2">{"Email:"}</span>
                {site.email}
              </p>
              <p className="pb-1 text-sm">
                <span className="text-muted-foreground pr-2">{"Phone:"}</span> {site.phone}
              </p>
              <p className="w-full pb-1 text-sm">
                <span className="text-muted-foreground pr-2">{"Address:"}</span> {site.address}
              </p>
            </div>
            <div className="pb-20">
              <h4 className="mb-2 text-lg font-semibold">{"Supported Payment"}</h4>
              <div className="flex space-x-2">
                <Icons.paypal className="h-6 w-9" />
                <Icons.visa className="h-10 w-auto" />
              </div>
            </div>
          </div>
          <div className="z-10 col-span-1 grid w-full grid-cols-1 md:col-span-2 pb-20">
            <div className="grid w-full grid-cols-1 gap-4 p-4 border-b md:grid-cols-4 pb-20">
              <div className="col-span-2">
                <h4 className="mb-2 text-lg font-semibold">{"Connect On Social"}</h4>
                <div className="flex gap-5">
                  <Social />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h4 className="mb-2 text-lg font-semibold">{"Sign up to our Newsletter"}</h4>
                <form className="flex space-x-2">
                  <Input className="flex-1" placeholder="Enter your email" type="email" />
                  <Button size={"sm"} type="submit">
                    {"Subscribe"}
                  </Button>
                </form>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-6 p-4">
              {footer?.map(({ title, submenu }) => {
                return (
                  <div key={title}>
                    <h3 className="mb-4 text-xl font-semibold">{(title && title) || "No Title"}</h3>
                    <ul className="space-y-1 text-sm md:space-y-2">
                      {submenu?.map(({ newTab, href, title }) => {
                        return (
                          <li key={href + title}>
                            <Link
                              className="underline-offset-4 hover:underline"
                              target={newTab ? "_blank" : "_self"}
                              href={href || PATH.ROOT}
                            >
                              {title || "No Title"}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex h-16 w-full items-center justify-between">
          <div className="flex h-full w-auto items-center justify-center">
            <AppBrand className="p-4 flex h-full border-r px-4 items-center justify-center" />
          </div>
          <div className="flex h-full w-auto items-center justify-center">
            <div className="border-l p-4 w-16">
              <ThemeToggle />
            </div>
            <div className="border-l p-4 w-16">
              <RSS />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
