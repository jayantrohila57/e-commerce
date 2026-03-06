import type { Route } from "next";
import Link from "next/link";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BlurImage } from "@/shared/components/ui/image";
import { PATH } from "@/shared/config/routes";

export default async function ShopByCategoryGrid() {
  const { data: categories } = await apiServer.category.getMany({
    query: {},
  });

  if (!categories) {
    return null;
  }
  return (
    <HydrateClient>
      <Section
        {...{
          title: "Shop by Category",
          description: "Explore our products by category",
          action: "View All Categories",
          actionLink: PATH.STORE.CATEGORIES.ROOT as Route,
        }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {categories?.map((category) => (
            <Link href={PATH.STORE.CATEGORIES.CATEGORY(category.slug) as Route} key={category.id}>
              <Card className="flex h-full flex-col justify-between pt-0 transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="overflow-hidden rounded-sm p-0">
                  <BlurImage
                    src={String(category.image)}
                    alt={category.title}
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
