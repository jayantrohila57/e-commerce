"use client";

import { ProductSubcategoryCards } from "@/module/product/product-subcategory-cards";
import { BlurImage } from "@/shared/components/common/image";
import { Separator } from "@/shared/components/ui/separator";
import { getImageSrc } from "@/shared/utils/lib/image.utils";
import type { GetSubcategoryBySlugOutput } from "./subcategory.types";

type FlattenedVariant = {
  id: string;
  slug: string;
  title: string;
  priceModifierType: string;
  priceModifierValue: string;
  attributes: { title: string; type: string; value: string }[] | null;
  media: { url: string }[] | null;
  productId: string;
  productTitle: string;
  productSlug: string;
  productDescription: string | null;
  productBasePrice: number;
  productBaseImage: string | null;
  finalPrice: number;
};

interface SubCategoryItemProps {
  data: GetSubcategoryBySlugOutput["data"];
  variants?: FlattenedVariant[];
}

export const SubCategoryItem = ({ data, variants }: SubCategoryItemProps) => {
  const subcategory = data?.subcategoryData;

  return (
    <div className="flex flex-col">
      {/* Subcategory Header */}
      <div className="flex flex-col items-center justify-center gap-4">
        {subcategory?.image && (
          <BlurImage
            src={getImageSrc(subcategory.image)}
            alt={subcategory.title}
            width={200}
            height={200}
            className="bg-secondary h-32 w-32 rounded-full object-cover"
          />
        )}
        <div className="text-center">
          <h1 className="text-3xl font-bold capitalize md:text-4xl">{subcategory?.title}</h1>
          {subcategory?.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl">{subcategory.description}</p>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Variants Grid */}
      {subcategory && (
        <ProductSubcategoryCards
          data={variants || []}
          categorySlug={subcategory.categorySlug}
          subcategorySlug={subcategory.slug}
        />
      )}
    </div>
  );
};
