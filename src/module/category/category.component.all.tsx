import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BlurImage } from "@/shared/components/ui/image";
import { Separator } from "@/shared/components/ui/separator";
import type { Route } from "next";
import Link from "next/link";
import type { GetCategoryWithSubcategoriesOutput } from "./category.types";

export const CategoryItem = ({ data }: { data: GetCategoryWithSubcategoriesOutput["data"] }) => {
  if (!data) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <h2 className="text-4xl capitalize">{data.title}</h2>
      </div>
      <Separator className="my-6" />
      <div className="grid-rows-auto mx-auto grid h-full w-full max-w-4xl grid-cols-4 gap-4 rounded-md">
        {data.subcategories?.map((subcategory) => (
          <div key={subcategory.id} className="group col-span-1">
            <Link href={`/store/${data.slug}/${subcategory.slug}` as Route}>
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="flex w-full items-center justify-center">
                  <BlurImage
                    src={String(subcategory.image)}
                    alt={subcategory.title}
                    width={500}
                    height={500}
                    className="motion-all bg-secondary aspect-square h-auto w-full rounded-full border object-cover group-hover:drop-shadow"
                  />
                </CardContent>
                <CardHeader className="text-center">
                  <CardTitle className="motion-all text-md text-center capitalize group-hover:text-blue-500">
                    {subcategory.title}
                  </CardTitle>
                  <CardDescription className="motion-all text-center capitalize">
                    {subcategory.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
