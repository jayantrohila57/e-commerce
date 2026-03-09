import type { Route } from "next";
import Link from "next/link";
import { BlurImage } from "@/shared/components/common/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getImageSrc } from "@/shared/utils/lib/image.utils";
import type { GetProductsBySeriesSlugOutput } from "./product.types";

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
export const VariantCardList = ({ data }: { data: GetProductsBySeriesSlugOutput["data"] }) => {
  const content = (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-4 lg:grid-cols-4">
      {data?.map((product) => {
        const href = `/store/${product?.categorySlug}/${product?.subcategorySlug}/${product?.seriesSlug}/${product?.variant.slug}`;

        return (
          <Link key={product?.variant.slug} href={href as Route}>
            <Card className="pt-0">
              <CardHeader className="p-0">
                <BlurImage
                  src={getImageSrc(product?.variant?.media?.[0]?.url)}
                  alt={product?.title ?? "Product"}
                  width={500}
                  height={500}
                  className="bg-secondary motion-all aspect-square w-full rounded-md rounded-b-none object-cover group-hover:drop-shadow"
                />
              </CardHeader>

              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg font-semibold">{product?.variant.title}</CardTitle>
                  <p className="text-sm">
                    ₹
                    {computePrice(
                      product?.basePrice,
                      Number(product?.variant.priceModifierValue),
                      product?.variant.priceModifierType,
                    )}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-1">
                  {product?.variant?.attributes?.map((attr) => (
                    <p key={attr.title} className="flex justify-between text-xs">
                      <span>{attr.title}</span>
                      <span className=" ">{attr.value}</span>
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );

  return content;
};
