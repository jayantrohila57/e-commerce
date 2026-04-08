# Structured data validation checklist

Use this after changing storefront pages, product data, or SEO helpers in `src/shared/seo/`.

## Content parity

- JSON-LD **names, descriptions, prices, images, SKU, availability, ratings, and review text** match what users see on the page (or the first page of reviews on the PDP, aligned with the reviews API).
- **ItemList** URLs match real links in the UI (same paths as `PATH.STORE` / product cards).
- **BreadcrumbList** order and labels match the store hierarchy (resolved category/subcategory titles, not slugs).
- Do not emit **SearchAction** unless `/store?q=` returns a visible filtered catalog (implemented on the store page).

## Technical checks

1. **View source** (or DevTools → Elements) and confirm `application/ld+json` scripts parse as JSON (no truncation or HTML in strings).
2. **Homepage** (`/`): one `@graph` with `WebPage` + `ItemList` blocks for featured categories and the first four “Shop by category” items only.
3. **Store** (`/store`): `CollectionPage` + `ItemList` of visible subcategory links; with `?q=`, list matches filtered results.
4. **Categories index** (`/store/categories`): `CollectionPage` + `ItemList` of all listed categories.
5. **Category / subcategory / PDP**: `@graph` includes expected types; PDP includes `Product`, `Offer`, optional `gtin*`, `AggregateRating`, `Review` (when approved reviews exist), and `BreadcrumbList`.
6. **Root layout**: single global `@graph` with `Organization` and `WebSite` (`#organization`, `#website` IDs).

## External tools

- [Rich Results Test](https://search.google.com/test/rich-results) — representative URLs: `/`, `/store`, `/store/categories`, `/store/{category}`, `/store/{category}/{subcategory}`, PDP variant URL.
- [Schema Markup Validator](https://validator.schema.org/) — paste extracted JSON-LD.

## Environment

- Set **`NEXT_PUBLIC_BASE_URL`** in production so `absoluteUrl`, sitemap, robots, and JSON-LD share the same origin (see `src/shared/seo/site-origin.ts`).

## Sitemap / robots

- Confirm [src/app/sitemap.ts](src/app/sitemap.ts) includes URLs you mark up.
- Confirm [src/app/robots.ts](src/app/robots.ts) allows crawling of store routes.
