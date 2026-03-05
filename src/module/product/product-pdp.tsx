import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/shared/components/common/add-to-cart-button";
import { ViewCartButton } from "@/shared/components/common/view-cart-button";
import WishListButton from "@/shared/components/common/wishlist-button";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { GetPDPProductOutput } from "./product.types";
import { extractAttributeGroups, isOptionAvailable, resolveNextVariant } from "./product-utility";

export const PDPProduct = ({ data, slug }: { data: GetPDPProductOutput["data"]; slug: string }) => {
  if (!data?.product) return <div>Product not found</div>;

  const product = data.product;
  const variants = product?.variants;

  const selectedVariant = variants.find((v) => v.slug === slug) ?? variants[0];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {selectedVariant?.media?.[0]?.url ? (
              <Image
                src={selectedVariant?.media?.[0].url}
                alt={product?.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No image available</div>
            )}
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
          <div className="space-y-4">
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
                          `/store/${product?.categorySlug}/${product?.subcategorySlug}/${product?.seriesSlug}/${nextVariant.slug}` as Route
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
              <AddToCartButton variantId={selectedVariant.id} size="lg" className="flex-1" />
              <ViewCartButton variantId={selectedVariant.id} className="flex-1" />
              <Button size="lg" variant="outline">
                Buy Now
              </Button>
            </div>
            <div className="flex justify-start">
              <WishListButton />
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
    </div>
  );
};
