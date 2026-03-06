import type { Route } from "next";
import Link from "next/link";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BlurImage } from "@/shared/components/ui/image";
import { PATH } from "@/shared/config/routes";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export default async function GetFeaturedCategories() {
  const { data: categories } = await apiServer.category.getAllFeaturedCategories({
    query: {},
  });

  if (!categories) {
    return null;
  }
  return (
    <HydrateClient>
      <Section
        {...{
          title: "Featured Categories",
          description: "Explore our featured categories",
        }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {categories?.map((category) => (
            <Link href={PATH.STORE.CATEGORIES.CATEGORY(category.slug) as Route} key={category.id}>
              <Card className="flex h-full flex-col justify-between pt-0 transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="overflow-hidden rounded-sm p-0">
                  <BlurImage
                    src={getImageSrc(category.image)}
                    alt={category.title ?? "Category"}
                    width={500}
                    height={500}
                    className="motion-all bg-secondary aspect-square h-auto w-full rounded-t-sm object-cover group-hover:drop-shadow"
                  />
                </CardContent>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-3 h-12">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </HydrateClient>
  );
}
