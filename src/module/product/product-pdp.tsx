import type { Route } from "next";
import Link from "next/link";
import { PDPWishlistToggle } from "@/module/product/product-pdp-wishlist-toggle";
import { ProductReviews } from "@/module/review/components/product-reviews";
import { AddToCartButton } from "@/shared/components/common/add-to-cart-button";
import { BlurImage } from "@/shared/components/common/image";
import { ViewCartButton } from "@/shared/components/common/view-cart-button";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { getImageSrc } from "@/shared/utils/lib/image.utils";
import type { GetPDPProductOutput } from "./product.types";
import { extractAttributeGroups, isOptionAvailable, resolveNextVariant } from "./product-utility";

interface PDPProductProps {
  data: GetPDPProductOutput["data"];
  slug: string;
  categorySlug?: string;
  subcategorySlug?: string;
}

export const PDPProduct = ({ data, slug, categorySlug, subcategorySlug }: PDPProductProps) => {
  if (!data?.product) return <div>Product not found</div>;

  const product = data.product;
  const variants = product?.variants ?? [];

  // Match by slug (case-insensitive, trimmed) - API puts URL-matched variant first
  const selectedVariant =
    variants.find((v) => v.slug?.toLowerCase().trim() === slug?.toLowerCase().trim()) ?? variants[0];

  if (!selectedVariant) {
    return <div>Variant not found</div>;
  }

  const attributeGroups = extractAttributeGroups(variants);

  const basePrice = Number(product?.basePrice);
  const priceModifier = Number(selectedVariant?.priceModifierValue) || 0;

  const finalPrice =
    selectedVariant?.priceModifierType === "percent_increase"
      ? basePrice * (1 + priceModifier / 100)
      : selectedVariant?.priceModifierType === "percent_decrease"
        ? basePrice * (1 - priceModifier / 100)
        : selectedVariant?.priceModifierType === "flat_increase"
          ? basePrice + priceModifier
          : basePrice - priceModifier;

  const pdpImageSrc = getImageSrc(selectedVariant?.media?.[0]?.url) ?? getImageSrc(product?.baseImage);

  // Use provided slugs or fall back to product's slugs
  const catSlug = categorySlug ?? product?.categorySlug;
  const subcatSlug = subcategorySlug ?? product?.subcategorySlug;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
            <BlurImage src={pdpImageSrc} alt={product?.title ?? "Product"} fill className="object-cover" priority />
            <div className="absolute right-3 top-3 z-10">
              <PDPWishlistToggle variantId={selectedVariant.id} />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product?.title}</h1>
          <p className="text-lg text-gray-600">{product?.description}</p>

          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">${finalPrice.toFixed(2)}</span>

            {selectedVariant?.priceModifierValue && (
              <Badge variant="outline">
                {selectedVariant?.priceModifierType === "percent_increase"
                  ? `+${priceModifier}%`
                  : `+$${priceModifier}`}
              </Badge>
            )}
          </div>

          {/* ---- ATTRIBUTES ---- */}
          <div className="space-y-4 flex flex-row gap-4">
            {Object.entries(attributeGroups).map(([title, values]) => (
              <div key={title}>
                <h3 className="text-sm font-medium capitalize">{title}</h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from(values).map((value) => {
                    const isSelected = selectedVariant?.attributes?.some((a) => a.title === title && a.value === value);

                    const available = isOptionAvailable({
                      variants,
                      current: selectedVariant,
                      changeAttrTitle: title,
                      changeAttrValue: value,
                    });

                    if (!available) {
                      return (
                        <Button
                          key={value}
                          size="sm"
                          variant="outline"
                          disabled
                          className="cursor-not-allowed opacity-40"
                        >
                          {value}
                        </Button>
                      );
                    }

                    const nextVariant = resolveNextVariant({
                      variants,
                      current: selectedVariant,
                      changeAttrTitle: title,
                      changeAttrValue: value,
                    });

                    return (
                      <Link
                        key={value}
                        href={
                          // 3-segment URL: /store/category/subcategory/variantSlug
                          `/store/${catSlug}/${subcatSlug}/${nextVariant.slug}` as Route
                        }
                        prefetch={false}
                      >
                        <Button size="sm" variant={isSelected ? "default" : "outline"} className="capitalize">
                          {value}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <div className="flex gap-4">
              <AddToCartButton variantId={selectedVariant.id} />
              <ViewCartButton variantId={selectedVariant.id} className="flex-1" />
              <Button size="lg" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-gray-600">{product?.description}</p>
            </div>

            <div>
              <h3 className="font-medium">Features</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {product?.features?.map((f, i) => (
                  <li key={i}>{f.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <ProductReviews productId={product.id} canWriteReview />
      </div>
    </div>
  );
};
