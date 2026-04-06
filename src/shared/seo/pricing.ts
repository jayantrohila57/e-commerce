import type { ProductBase } from "@/module/product/product.types";
import type { ProductVariantBase } from "@/module/product-variant/product-variant.types";

/** Same rules as `product-pdp.tsx` for consistent Offer schema and metadata. */
export function computeVariantUnitPrice(
  product: Pick<ProductBase, "basePrice">,
  variant: Pick<ProductVariantBase, "priceModifierType" | "priceModifierValue">,
): number {
  const basePrice = Number(product.basePrice);
  const priceModifier = Number(variant.priceModifierValue) || 0;

  switch (variant.priceModifierType) {
    case "percent_increase":
      return basePrice * (1 + priceModifier / 100);
    case "percent_decrease":
      return basePrice * (1 - priceModifier / 100);
    case "flat_increase":
      return basePrice + priceModifier;
    case "flat_decrease":
      return basePrice - priceModifier;
    default:
      return basePrice;
  }
}

export function formatSchemaPrice(value: number): string {
  return value.toFixed(2);
}
