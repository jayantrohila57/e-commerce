import type { Route } from "next";
import Link from "next/link";
import { forbidden, redirect } from "next/navigation";
import { HydrateClient } from "@/core/api/api.server";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { slugToTitle } from "@/shared/utils/lib/url.utils";

export default async function SeriesPage({
  params,
}: PageProps<"/studio/catalog/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]">) {
  const { session, user } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);
  if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) forbidden();

  const { categorySlug: slug, subCategorySlug: sub, seriesSlug: series } = await params;
  const storefrontSeriesUrl = `/store/${slug}/${sub}/${series}` as Route;
  const studioProductsUrl =
    `${PATH.STUDIO.PRODUCTS.ROOT}?categorySlug=${encodeURIComponent(slug)}&subcategorySlug=${encodeURIComponent(sub)}` as Route;

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(series)}
            description="Series is a URL segment in the storefront hierarchy (category → subcategory → series). It is not a separate database entity; manage products and variants from the catalog."
          >
            <div className="flex max-w-2xl flex-col gap-4 p-4 text-sm text-muted-foreground">
              <p>
                Customer-facing listing for this segment:{" "}
                <span className="font-mono text-xs text-foreground">{storefrontSeriesUrl}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="default" size="sm">
                  <Link href={storefrontSeriesUrl}>View on storefront</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={studioProductsUrl}>Open products (filtered)</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={PATH.STUDIO.CATEGORIES.ROOT}>Back to categories</Link>
                </Button>
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
