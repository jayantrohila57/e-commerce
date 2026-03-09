import type { Route } from "next";
import Link from "next/link";
import { apiServer } from "@/core/api/api.server";
import CodePreview from "@/shared/components/common/code-preview";
import { BlurImage } from "@/shared/components/common/image";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export const metadata = {
  title: "Store",
  description: "Store Home",
};

export default async function StorePage() {
  const { data } = await apiServer.category.getManyWithSubcategories({
    query: {},
  });

  return (
    <Shell>
      <Shell.Section>
        {data?.map((category) => (
          <Section
            key={category.id}
            title={category.title}
            description={category.description ?? ""}
            action="View All "
            actionLink={PATH.STORE.CATEGORIES.CATEGORY(category.slug) as Route}
          >
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {category?.subcategories?.map((subcategory) => (
                <Link
                  href={PATH.STORE.SUB_CATEGORIES.SUBCATEGORY(subcategory?.slug, category.slug) as Route}
                  key={subcategory?.id}
                >
                  <Card className="flex h-full flex-col justify-between pt-0 transition-shadow duration-300 hover:shadow-lg">
                    <CardContent className="overflow-hidden rounded-sm p-0">
                      <BlurImage
                        src={getImageSrc(subcategory?.image)}
                        alt={subcategory?.title ?? "Subcategory"}
                        width={500}
                        height={500}
                        className="motion-all bg-secondary aspect-square h-auto w-full rounded-t-sm object-cover group-hover:drop-shadow"
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">{subcategory?.title}</CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-3 h-12">
                        {subcategory?.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </Section>
        ))}
      </Shell.Section>
    </Shell>
  );
}
