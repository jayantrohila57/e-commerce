"use client";

import type { Route } from "next";
import Link from "next/link";
import { BlurImage } from "@/shared/components/common/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

const computePrice = (basePrice: number, priceModifierValue: number, priceModifierType: string): number => {
  const base = basePrice;
  const val = Number(priceModifierValue);

  switch (priceModifierType) {
    case "flat_increase":
      return base + val;
    case "flat_decrease":
      return base - val;
    case "percent_increase":
      return base + Math.round((base * val) / 100);
    case "percent_decrease":
      return base - Math.round((base * val) / 100);
    default:
      return base;
  }
};

const formatPrice = (priceInPaise: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInPaise / 100);
};

type ProductVariant = {
  id: string;
  slug: string;
  title: string;
  productId: string;
  priceModifierType: string;
  priceModifierValue: string;
  attributes: { title: string; type: string; value: string }[] | null;
  media: { url: string }[] | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

type ProductWithVariants = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  basePrice: number;
  baseImage: string | null;
  categorySlug: string;
  subcategorySlug: string;
  variants: ProductVariant[];
};

interface ProductSubcategoryCardsProps {
  data: ProductWithVariants[];
  categorySlug: string;
  subcategorySlug: string;
}

export function ProductSubcategoryCards({ data, categorySlug, subcategorySlug }: ProductSubcategoryCardsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((product) => {
        // If product has variants, show the first variant as the default
        const defaultVariant = product.variants?.[0];

        // Build the product URL - if there's a variant, link to variant page
        const href = defaultVariant
          ? (`/store/${categorySlug}/${subcategorySlug}/${product.slug}/${defaultVariant.slug}` as Route)
          : (`/store/${categorySlug}/${subcategorySlug}/${product.slug}` as Route);

        // Calculate display price
        const displayPrice = defaultVariant
          ? computePrice(product.basePrice, Number(defaultVariant.priceModifierValue), defaultVariant.priceModifierType)
          : product.basePrice;

        // Get display image - variant media first, then product base image
        const displayImage = defaultVariant?.media?.[0]?.url || product.baseImage;

        return (
          <Link key={product.id} href={href} className="group">
            <Card className="pt-0 transition-shadow hover:shadow-md">
              <CardHeader className="p-0">
                <BlurImage
                  src={getImageSrc(displayImage)}
                  alt={product.title ?? "Product"}
                  width={500}
                  height={500}
                  className="bg-secondary motion-all aspect-square w-full rounded-md rounded-b-none object-cover group-hover:drop-shadow"
                />
              </CardHeader>

              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg font-semibold line-clamp-1">{product.title}</CardTitle>
                  <p className="text-lg font-medium text-primary">{formatPrice(displayPrice)}</p>
                </div>

                {defaultVariant?.attributes && defaultVariant.attributes.length > 0 && (
                  <div className="mt-auto flex flex-col gap-1">
                    {defaultVariant.attributes.slice(0, 3).map((attr) => (
                      <p key={attr.title} className="flex justify-between text-xs text-muted-foreground">
                        <span>{attr.title}</span>
                        <span>{attr.value}</span>
                      </p>
                    ))}
                    {defaultVariant.attributes.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{defaultVariant.attributes.length - 3} more options
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
