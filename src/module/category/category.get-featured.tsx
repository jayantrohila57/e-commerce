import type { Route } from "next";
import Link from "next/link";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { BlurImage } from "@/shared/components/common/image";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
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
          title: "Featured",
          description: "Explore our featured categories",
          action: "View All",
          actionLink: PATH.STORE.CATEGORIES.ROOT,
        }}
      >
        <div className="grid grid-cols-1 h-full w-full border-b sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {categories?.map((category) => (
            <Link href={PATH.STORE.CATEGORIES.CATEGORY(category.slug) as Route} key={category.id}>
              <Card className="flex h-full p-4 gap-0 rounded-none border-r last:border-l-0 ring-0 bg-transparent flex-col justify-between hover:bg-secondary">
                <div className="overflow-hidden p-0 h-auto w-full aspect-4/5">
                  <BlurImage
                    src={getImageSrc(category.image)}
                    alt={category.title ?? "Category"}
                    width={500}
                    height={500}
                    className="motion-all bg-secondary h-full w-full rounded-t-sm object-cover group-hover:drop-shadow"
                  />
                </div>
                <CardHeader className="border-t p-4">
                  <CardTitle className="text-2xl font-semibold">{category.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground line-clamp-3">
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
