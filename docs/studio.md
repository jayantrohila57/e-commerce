# Studio Pages Status

Status of routes under [`src/app/(studio)`](../src/app/(studio)). For route-level completion percentages and cross-cutting gaps, see [`screen-audit.md`](screen-audit.md) (Studio section).

## Dashboard and shell

| Page path | Status | Details |
| --------- | ------ | ------- |
| `studio/page.tsx` | Partial | Live KPIs via `analytics.studioDashboardKpis`; chart area is still a placeholder. |
| `studio/layout.tsx` | Complete | Studio shell with sidebar. |
| `studio/not-found.tsx` | Complete | Studio 404. |
| `studio/[...catchAll]/page.tsx` | Complete | Catch-all → `notFound()`. |
| `studio/error.tsx` | Complete | Error boundary. |
| `studio/forbidden.tsx` | Complete | Forbidden state. |
| `studio/loading.tsx` | Complete | Loading UI. |

## Catalog

| Page path | Status | Details |
| --------- | ------ | ------- |
| `studio/catalog/page.tsx` | Complete | Catalog overview. |
| `studio/catalog/products/*` | Mostly complete | List, CRUD, variants; storefront preview links may need alignment (see screen-audit). |
| `studio/catalog/categories/*` | Mostly complete | List, category CRUD, subcategory list/add; subcategory detail includes product table when scoped. |
| `studio/catalog/categories/.../[subCategorySlug]/edit-subcategory` | Complete | `SubcategoryEditForm` + `notFound()`. |
| `studio/catalog/categories/.../[seriesSlug]` | Placeholder | No `add-new-series` route; series drill-down is minimal (storefront may still use series slugs). |
| `studio/catalog/attributes/*` | Mostly complete | List, add, detail, edit. |

## Commerce and payments

| Page path | Status | Details |
| --------- | ------ | ------- |
| `studio/orders/*` | Mostly complete | List and detail. |
| `studio/payment/*` | Mostly complete | List and detail; align staff vs API where noted in screen-audit. |
| `studio/discounts/*` | Mostly complete | List, create, edit (form loads existing discount). |

## Inventory and shipping

| Page path | Status | Details |
| --------- | ------ | ------- |
| `studio/inventory/*` | Mostly complete | Stock, movements view, warehouses, create/edit. |
| `studio/shipping/*` | Mostly complete | Shipments + providers, zones, methods, rates; see screen-audit for empty-state / IA notes. |

## Marketing and content

| Page path | Status | Details |
| --------- | ------ | ------- |
| `studio/marketing/page.tsx` | Redirect | Redirects to `marketing/content`. |
| `studio/marketing/content/*` | Mostly complete | List, create, edit. |

## Users and reviews

| Page path | Status | Details |
| --------- | ------ | ------- |
| `studio/users/page.tsx` | Mostly complete | Admin user table; filters include role, banned, email verified (server-side). |
| `studio/users/new/page.tsx` | Complete | Create-customer entry (sign-up style) for operators. |
| `studio/users/[userId]/page.tsx` | Mostly complete | Detail, role, ban. |
| `studio/reviews/page.tsx` | Mostly complete | Moderation list with approve/reject; linked from sidebar. |

## Config vs routes

Constants in [`src/shared/config/routes.ts`](../src/shared/config/routes.ts) under `PATH.STUDIO.MARKETING` (campaigns, newsletters, promotions, coupons as separate trees), `PATH.STUDIO.ANALYTICS`, and `PATH.STUDIO.SETTINGS` do **not** yet have matching App Router pages. Prefer [`PATH.STUDIO.DISCOUNTS`](../src/shared/config/routes.ts) for coupon-style codes until dedicated marketing routes exist.
