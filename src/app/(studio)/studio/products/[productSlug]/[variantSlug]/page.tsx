import type { Route } from "next";
import { notFound, redirect } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Variant",
  description: "View and manage product variant details",
};

export default async function VariantDetailPage({ params }: PageProps<"/studio/products/[productSlug]/[variantSlug]">) {
  const { productSlug, variantSlug } = await params;
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const { data: variant } = await apiServer.productVariant.getBySlug({
    params: { slug: variantSlug },
  });

  if (!variant) notFound();

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={variant.title}
            description="Variant details and configuration"
            action="Edit Variant"
            actionUrl={PATH.STUDIO.PRODUCTS.VARIANTS.EDIT(productSlug, variantSlug, variant.id) as Route}
          >
            <div className="space-y-4">
              <div className="bg-secondary rounded-md border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {variant.slug}
                  </Badge>
                  <Badge variant="outline">{variant.priceModifierType}</Badge>
                  <Badge variant="outline" className="font-mono">
                    {String(variant.priceModifierValue)}
                  </Badge>
                </div>
                <Separator className="my-4" />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Inventory</p>
                    {variant.inventory ? (
                      <div className="text-sm">
                        <span className="font-mono">{variant.inventory.sku}</span>
                        <span className="text-muted-foreground"> · Qty: </span>
                        <span className="font-mono">{variant.inventory.quantity}</span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No inventory record</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Attributes</p>
                    <div className="flex flex-wrap gap-2">
                      {(variant.attributes ?? []).length ? (
                        (variant.attributes ?? []).map((a, idx) => (
                          <Badge key={`${a.title}-${idx}`} variant="outline">
                            {a.title}: {a.value}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No attributes</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-md border p-4">
                <p className="text-muted-foreground mb-2 text-xs">Media</p>
                <div className="flex flex-wrap gap-2">
                  {(variant.media ?? []).length ? (
                    (variant.media ?? []).map((m, idx) => (
                      <Badge key={`${m.url}-${idx}`} variant="secondary" className="max-w-full truncate font-mono">
                        {m.url}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No media</p>
                  )}
                </div>
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
