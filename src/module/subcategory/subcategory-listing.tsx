import type { Route } from "next";
import Link from "next/link";
import { BlurImage } from "@/shared/components/common/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { getImageSrc } from "@/shared/utils/lib/image.utils";
import type { GetSubcategoryBySlugOutput } from "./subcategory.types";

export const SubCategoryItem = ({ data }: { data: GetSubcategoryBySlugOutput["data"] }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <h2 className="text-4xl capitalize">{data?.subcategoryData?.title}</h2>
      </div>
      <Separator className="my-6" />
      {/* TODO: Replace with product listing - products now directly belong to subcategories */}
      <p className="text-muted-foreground text-sm">Product listing will be implemented here.</p>
    </div>
  );
};
