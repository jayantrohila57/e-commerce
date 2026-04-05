import type { Route } from "next";
import Link from "next/link";
import { forbidden, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

type CatalogStatCardProps = {
  title: string;
  description: string;
  value: number;
  href: Route;
  ctaLabel?: string;
};

function CatalogStatCard({ title, description, value, href, ctaLabel = "Manage" }: CatalogStatCardProps) {
  return (
    <Card className="bg-transparent border-none border-r border-b">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <div className="text-4xl font-mono font-bold tracking-tight">{value?.toLocaleString()}</div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button variant="link">{ctaLabel}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function CatalogOverviewPage() {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const res = await apiServer.catalog.overview({});
  const stats = res.data ?? {
    totalProducts: 0,
    totalProductVariants: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalAttributes: 0,
  };

  const items: CatalogStatCardProps[] = [
    {
      title: "Products",
      description: "Total number of products in your catalog",
      value: stats?.totalProducts,
      href: PATH.STUDIO.PRODUCTS.ROOT as Route,
    },
    {
      title: "Product Variants",
      description: "Variants and inventory combinations for your products",
      value: stats?.totalProductVariants,
      href: PATH.STUDIO.INVENTORY.ROOT as Route,
    },
    {
      title: "Categories",
      description: "Top-level product categories",
      value: stats?.totalCategories,
      href: PATH.STUDIO.CATEGORIES.ROOT as Route,
    },
    {
      title: "Subcategories",
      description: "Nested categories managed within each category",
      value: stats?.totalSubcategories,
      href: PATH.STUDIO.CATEGORIES.ROOT as Route,
      ctaLabel: "Manage Categories",
    },
    {
      title: "Attributes",
      description: "Attributes and options used to describe products",
      value: stats?.totalAttributes,
      href: PATH.STUDIO.ATTRIBUTES.ROOT as Route,
    },
  ];

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title="Catalog Overview"
            description="High-level summary of your catalog with quick navigation to management pages."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 w-full">
              {items.map((item) => (
                <CatalogStatCard key={item?.title} {...item} />
              ))}
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
