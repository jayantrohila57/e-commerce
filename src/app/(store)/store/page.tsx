import type { Route } from "next";
import { apiServer } from "@/core/api/api.server";
import CategoryCard from "@/module/category/category-card";
import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { buildSchemaGraph, collectionPageGraphNode, itemListGraphNode } from "@/shared/seo/json-ld";
import { JsonLdScript } from "@/shared/seo/json-ld-script";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";
import { absoluteUrl } from "@/shared/seo/site-origin";

export const metadata = buildPageMetadata({
  title: "Store",
  description: `Shop ${site.name} — browse categories and discover products.`,
  canonicalPath: "/store",
  ogType: "website",
});

type CategoryWithSubs = NonNullable<
  Awaited<ReturnType<typeof apiServer.category.getManyWithSubcategories>>["data"]
>[number];

function filterCategoriesByQuery(categories: CategoryWithSubs[] | null | undefined, qRaw: string): CategoryWithSubs[] {
  if (!categories?.length) return [];
  const q = qRaw.trim().toLowerCase();
  if (!q) return categories;

  return categories
    .map((cat) => {
      const catMatch = cat.title.toLowerCase().includes(q) || (cat.description?.toLowerCase().includes(q) ?? false);
      if (catMatch) return cat;
      const subs = cat.subcategories?.filter(
        (sub) => sub.title.toLowerCase().includes(q) || (sub.description?.toLowerCase().includes(q) ?? false),
      );
      if (!subs?.length) return null;
      return { ...cat, subcategories: subs };
    })
    .filter((c): c is CategoryWithSubs => c != null);
}

export default async function StorePage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const sp = await searchParams;
  const rawQ = sp?.q;
  const q = typeof rawQ === "string" ? rawQ : Array.isArray(rawQ) ? (rawQ[0] ?? "") : "";

  const { data } = await apiServer.category.getManyWithSubcategories({
    query: {},
  });

  const filtered = filterCategoriesByQuery(data, q);

  const listItems = filtered.flatMap((category) =>
    (category.subcategories ?? []).map((sub) => ({
      name: `${category.title} — ${sub.title}`,
      url: absoluteUrl(PATH.STORE.SUB_CATEGORIES.SUBCATEGORY(sub.slug, category.slug)),
    })),
  );

  const storeLd = buildSchemaGraph([
    collectionPageGraphNode({
      name: "Store",
      description: `Shop ${site.name} — browse categories and discover products.`,
      path: "/store",
    }),
    itemListGraphNode({
      name: q.trim() ? `Store results for “${q.trim()}”` : "Store categories and subcategories",
      description: q.trim()
        ? "Subcategories matching your search on the store."
        : "Browse categories and subcategories from the store.",
      path: "/store",
      idSuffix: "catalog",
      items: listItems,
    }),
  ]);

  return (
    <Shell>
      <JsonLdScript id="jsonld-store" data={storeLd} />
      <Shell.Section>
        <ContentAnnouncementBar page="store" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="store" />
      </Shell.Section>
      <Shell.Section>
        <ContentSplitBanner page="store" />
      </Shell.Section>
      <Shell.Section>
        {q.trim() && filtered.length === 0 ? (
          <p className="text-muted-foreground px-4 py-8 text-center text-sm">
            No categories or subcategories match &quot;{q.trim()}&quot;. Try a different search term.
          </p>
        ) : (
          filtered.map((category) => (
            <Section
              key={category.id}
              title={category.title}
              description={category.description ?? ""}
              action="View All "
              actionLink={PATH.STORE.CATEGORIES.CATEGORY(category.slug) as Route}
            >
              <div className="grid mb-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {category?.subcategories?.map((subcategory) => (
                  <CategoryCard
                    key={subcategory.id}
                    id={subcategory.id}
                    href={PATH.STORE.SUB_CATEGORIES.SUBCATEGORY(subcategory?.slug, category.slug) as Route}
                    title={subcategory.title}
                    description={subcategory.description}
                    image={subcategory.image}
                  />
                ))}
              </div>
            </Section>
          ))
        )}
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="store" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="store" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="store" />
      </Shell.Section>
    </Shell>
  );
}
