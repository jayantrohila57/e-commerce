# Route Flow Audit

Audit date: `2026-03-16`

Verification scope:

- Read every `src/app/**/page.tsx` route.
- Read all `src/app/api/**/route.ts` handlers.
- Traced the directly related modules/components/hooks each route depends on.
- Ran `pnpm run check` successfully.

How to read this document:

- `Completion %` is a pragmatic heuristic for how much of the intended user journey is actually implemented.
- `Complete` means the main route job is wired end to end.
- `Mostly complete` means the route works, but there are notable dead ends, missing polish, or dependency gaps.
- `Partial` means a useful route exists, but important parts are stubbed, mismatched, or incomplete.
- `Placeholder` means the route is mostly static shell content.
- `Redirect / Fallback` means the route only redirects or handles unmatched/error cases by design.

## Overview

### Public And Auth Overview

| Route | Status | Completion | Notes |
| --- | --- | ---: | --- |
| [`/`](#route-home) | Mostly complete | 75% | Real home composition, but strongly dependent on seeded categories and marketing content blocks. |
| [`/marketing/about`](#route-marketing-about) | Partial | 40% | Real content block shell, but the page body is still a basic heading/paragraph placeholder. |
| [`/marketing/newsletter`](#route-marketing-newsletter) | Partial | 40% | Same pattern as `/marketing/about`; no subscription workflow exists. |
| [`/support`](#route-support-root) | Placeholder | 20% | Static heading only; support flows are not implemented. |
| [`/support/contact`](#route-support-contact) | Placeholder | 25% | Static copy only; no contact form or channel detail. |
| [`/support/faq`](#route-support-faq) | Placeholder | 15% | Literal placeholder heading. |
| [`/support/help-center`](#route-support-help-center) | Placeholder | 15% | Literal placeholder heading. |
| [`/support/returns`](#route-support-returns) | Placeholder | 25% | Same static template as `/support/contact`. |
| [`/support/shipping`](#route-support-shipping) | Placeholder | 25% | Same static template as `/support/contact`. |
| [`/support/tickets`](#route-support-tickets) | Placeholder | 20% | Static title only; no ticket backend exists. |
| [`/support/tickets/[ticketId]`](#route-support-ticket-detail) | Placeholder | 20% | Static title only; no ticket model exists. |
| [`/legal`](#route-legal-root) | Placeholder | 30% | Shell and sidebar exist, but the root page has no main content. |
| [`/legal/[slug]`](#route-legal-slug) | Complete | 90% | Static policy engine is implemented and reusable across all legal slugs. |
| [`/auth`](#route-auth-root) | Mostly complete | 80% | Useful route hub for auth entry points. |
| [`/auth/sign-in`](#route-auth-sign-in) | Mostly complete | 85% | Working Better Auth email + GitHub sign-in. |
| [`/auth/sign-up`](#route-auth-sign-up) | Mostly complete | 85% | Working Better Auth sign-up + verification path. |
| [`/auth/forgot-password`](#route-auth-forgot-password) | Mostly complete | 85% | Working reset email request flow. |
| [`/auth/reset-password`](#route-auth-reset-password) | Mostly complete | 80% | Working reset form, but the footer support link is misrouted. |
| [`/auth/verify-email`](#route-auth-verify-email) | Mostly complete | 80% | Working resend flow, but the page is still mostly utilitarian. |

### Commerce Overview

| Route | Status | Completion | Notes |
| --- | --- | ---: | --- |
| [`/store`](#route-store-root) | Mostly complete | 80% | Real category/subcategory browsing flow. |
| [`/store/categories`](#route-store-categories) | Mostly complete | 85% | Working category listing. |
| [`/store/[categorySlug]`](#route-store-category) | Mostly complete | 75% | Real category drilldown, but several marketing sections are commented out. |
| [`/store/[categorySlug]/[subCategorySlug]`](#route-store-subcategory) | Mostly complete | 75% | Real variant listing, but several supporting sections are disabled. |
| [`/store/[categorySlug]/[subCategorySlug]/[variantSlug]`](#route-store-pdp) | Partial | 65% | PDP works, but `Buy Now` is dead, reviews are absent, and currency presentation is inconsistent. |
| [`/store/checkout`](#route-store-checkout) | Mostly complete | 80% | End-to-end order + Razorpay flow exists, but checkout summary does not reflect shipping method pricing. |
| [`/store/checkout/confirmation`](#route-store-checkout-confirmation) | Mostly complete | 85% | Real confirmation page backed by order lookup. |
| [`/store/order/[id]`](#route-store-order-detail) | Complete | 85% | Working post-purchase order detail route with shipment tracking. |
| [`/account`](#route-account-root) | Mostly complete | 80% | Profile/security/session management is real, but one callback route is wrong. |
| [`/account/cart`](#route-account-cart) | Mostly complete | 75% | Cart management works for signed-in users, but there is no public cart route despite guest cart support in hooks. |
| [`/account/wishlist`](#route-account-wishlist) | Mostly complete | 75% | Wishlist management works, but it is only accessible through the account area. |
| [`/account/order`](#route-account-orders) | Mostly complete | 80% | Real order history. |
| [`/account/order/[id]`](#route-account-order-detail) | Complete | 85% | Working order detail and shipment tracking. |
| [`/account/order/[id]/invoice`](#route-account-invoice) | Placeholder | 0% | Empty route. |
| [`/account/payment`](#route-account-payment) | Mostly complete | 75% | Real payment summary list, but implemented as sequential per-order queries. |
| [`/account/address`](#route-account-addresses) | Complete | 85% | Working address book. |
| [`/account/address/new`](#route-account-address-new) | Complete | 85% | Working address creation form. |
| [`/account/address/[id]/edit`](#route-account-address-edit) | Mostly complete | 80% | Working edit form, but it depends on the list query already having the target address. |
| [`/account/review`](#route-account-review) | Placeholder | 10% | Explicitly marked as future Phase 25 functionality. |
| [`/account/setting`](#route-account-setting) | Placeholder | 10% | Empty card shell only. |
| [`/account/shipment`](#route-account-shipment) | Mostly complete | 75% | Real shipment list, but built via sequential per-order lookups. |

### Studio Overview

| Route | Status | Completion | Notes |
| --- | --- | ---: | --- |
| [`/studio`](#route-studio-root) | Partial | 30% | Studio shell works, but dashboard content is hard-coded and placeholder-heavy. |
| [`/studio/catalog`](#route-studio-catalog-overview) | Complete | 85% | Working catalog stats overview. |
| [`/studio/catalog/categories`](#route-studio-categories) | Complete | 90% | Real paginated category table. |
| [`/studio/catalog/categories/add-new-category`](#route-studio-add-category) | Mostly complete | 85% | Working category creation form. |
| [`/studio/catalog/categories/[categorySlug]`](#route-studio-category-detail) | Mostly complete | 80% | Good detail page with preview and subcategory management. |
| [`/studio/catalog/categories/[categorySlug]/subcategory`](#route-studio-category-subcategory-table) | Complete | 85% | Real subcategory table filtered to category. |
| [`/studio/catalog/categories/[categorySlug]/add-new-subcategory`](#route-studio-add-subcategory) | Mostly complete | 85% | Working subcategory creation flow. |
| [`/studio/catalog/categories/[categorySlug]/edit-category`](#route-studio-edit-category) | Mostly complete | 85% | Working category edit form. |
| [`/studio/catalog/categories/[categorySlug]/[subCategorySlug]`](#route-studio-subcategory-detail) | Partial | 55% | Preview exists, but product listing is explicitly TODO. |
| [`/studio/catalog/categories/[categorySlug]/[subCategorySlug]/edit-subcategory`](#route-studio-edit-subcategory) | Placeholder | 10% | Debug-style placeholder; no edit form. |
| [`/studio/catalog/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]`](#route-studio-series-detail) | Placeholder | 0% | Debug shell only. |
| [`/studio/catalog/attributes`](#route-studio-attributes) | Complete | 90% | Real attribute CRUD list. |
| [`/studio/catalog/attributes/add-new-attribute`](#route-studio-add-attribute) | Mostly complete | 85% | Working attribute creation form. |
| [`/studio/catalog/attributes/[attributeSlug]`](#route-studio-attribute-detail) | Mostly complete | 85% | Real detail preview page. |
| [`/studio/catalog/attributes/[attributeSlug]/edit-attribute`](#route-studio-edit-attribute) | Mostly complete | 85% | Working edit form. |
| [`/studio/catalog/products`](#route-studio-products) | Mostly complete | 80% | Real product table, but "view in store" routes point to a non-existent path family. |
| [`/studio/catalog/products/add-new-product`](#route-studio-add-product) | Mostly complete | 85% | Working creation form with preview tab. |
| [`/studio/catalog/products/[productSlug]`](#route-studio-product-detail) | Mostly complete | 80% | Good preview + variants page, but not-found handling is thin. |
| [`/studio/catalog/products/[productSlug]/edit-product`](#route-studio-edit-product) | Mostly complete | 85% | Working product edit form. |
| [`/studio/catalog/products/[productSlug]/add-new-variant`](#route-studio-add-variant) | Mostly complete | 85% | Working variant creation form. |
| [`/studio/catalog/products/[productSlug]/[variantSlug]`](#route-studio-variant-detail) | Mostly complete | 80% | Good variant detail view. |
| [`/studio/catalog/products/[productSlug]/[variantSlug]/edit-variant`](#route-studio-edit-variant) | Mostly complete | 85% | Working variant edit form. |
| [`/studio/inventory`](#route-studio-inventory) | Partial | 65% | Table works, but create-route CTAs point to a missing page. |
| [`/studio/inventory/[inventoryId]`](#route-studio-inventory-detail) | Partial | 70% | Useful detail page, but missing explicit not-found handling. |
| [`/studio/inventory/[inventoryId]/edit-inventory`](#route-studio-inventory-edit) | Partial | 70% | Edit form works, but missing explicit not-found handling and has a non-functional "Save Draft" button. |
| [`/studio/orders`](#route-studio-orders) | Mostly complete | 80% | Real admin order table. |
| [`/studio/orders/[orderId]`](#route-studio-order-detail) | Mostly complete | 80% | Strong detail page, but several action buttons are still inert. |
| [`/studio/payment`](#route-studio-payments) | Mostly complete | 85% | Real payment table. |
| [`/studio/payment/[paymentId]`](#route-studio-payment-detail) | Mostly complete | 85% | Real payment detail view. |
| [`/studio/shipping`](#route-studio-shipping) | Mostly complete | 85% | Real shipment table. |
| [`/studio/shipping/[shippingId]`](#route-studio-shipping-detail) | Complete | 90% | Strong shipment status management flow. |
| [`/studio/users`](#route-studio-users) | Partial | 70% | Real user management table, but some filters are parsed and then ignored; create-user empty state points to a missing route. |
| [`/studio/users/[userId]`](#route-studio-user-detail) | Mostly complete | 80% | Real admin detail page with role + ban controls. |
| [`/studio/marketing`](#route-studio-marketing-redirect) | Redirect / Fallback | 100% | Intentionally redirects to content management. |
| [`/studio/marketing/content`](#route-studio-marketing-content) | Complete | 90% | Real marketing content table. |
| [`/studio/marketing/content/new`](#route-studio-marketing-content-new) | Complete | 90% | Real marketing content creation form. |
| [`/studio/marketing/content/[id]/edit`](#route-studio-marketing-content-edit) | Complete | 90% | Real marketing content edit form. |
| [`/studio/[...catchAll]`](#route-studio-catchall) | Redirect / Fallback | 100% | Correct catch-all that immediately triggers `notFound()`. |

### Service Overview

| Route | Status | Completion | Notes |
| --- | --- | ---: | --- |
| [`/api/v1/[[...rest]]`](#route-api-trpc) | Complete | 90% | Main tRPC transport is working. |
| [`/api/auth/[...all]`](#route-api-auth) | Partial | 75% | Better Auth route works, but Arcjet path matching needs tighter verification for provider-specific auth posts. |
| [`/api/blob/upload`](#route-api-blob-upload) | Partial | 70% | Upload route works, but it only checks auth; file validation is minimal. |
| [`/api/order`](#route-api-order-legacy) | Redirect / Fallback | 100% | Intentionally retired legacy route returning `410`. |
| [`/api/webhooks/razorpay`](#route-api-razorpay-webhook) | Mostly complete | 85% | Real signature verification + reconciliation flow. |

## Shared Dependencies And Reuse

<a id="shared-auth-and-role-guards"></a>
### Shared Auth And Role Guards

| Shared dependency | What it affects | Status | Notes |
| --- | --- | --- | --- |
| Better Auth server/client (`src/core/auth/auth.ts`, `auth.server.ts`, `auth.client.ts`) | All `/auth`, `/account`, and `/studio` routes | Mostly complete | Core auth flows are real and typed. |
| Role guards (`src/core/auth/auth.roles.ts`, `src/app/(studio)/layout.tsx`) | All `/studio/**` routes | Complete | Studio access is restricted to `admin` and `staff`. |
| Arcjet guard (`src/app/api/auth/[...all]/arkjet.config.ts`) | Auth POST traffic | Partial | Sign-in/sign-up protection exists, but the path matching is narrow and should be confirmed against actual Better Auth POST endpoints. |
| Auth card shell (`src/shared/components/layout/section/auth.card-layout.tsx`) | All `/auth/**` pages | Partial | Reused well, but the help email is still `support@yourapp.com`. |

<a id="shared-commerce-state-and-trpc"></a>
### Shared Commerce State And tRPC

| Shared dependency | What it affects | Status | Notes |
| --- | --- | --- | --- |
| tRPC app router (`src/core/api/api.routes.ts`) | Store, account, studio, service routes | Complete | Central data contract passes typecheck. |
| Guest + user cart hooks (`src/module/cart/use-cart.ts`, `cart.api.ts`) | PDP, header cart button, `/account/cart`, checkout | Partial | Guest carts exist, but the UI routes for viewing/managing cart are account-only. |
| Address book (`src/module/address/use-address.ts`, `address.api.ts`) | `/account/address*`, checkout | Complete | Real CRUD and default-address flow. |
| Order pipeline (`src/module/order/order.api.ts`) | Checkout, order history/detail, studio orders | Mostly complete | End-to-end order creation exists, but downstream UI still has a few dead action buttons. |
| Payment pipeline (`src/module/payment/payment.api.ts`) | Checkout, account payments, studio payments, webhook | Mostly complete | Razorpay intent + confirm flow is real. |
| Shipment pipeline (`src/module/shipment/shipment.api.ts`) | Store/account order detail, account shipments, studio shipping | Mostly complete | Creation and status updates exist. |

<a id="shared-marketing-content-blocks"></a>
### Shared Marketing Content Blocks

| Shared dependency | What it affects | Status | Notes |
| --- | --- | --- | --- |
| Marketing content fetcher (`src/module/marketing-content/marketing-content.fetch.ts`) | Home, support layout, marketing pages, checkout | Mostly complete | Public pages render real DB-backed content if records exist. |
| Marketing content CRUD (`src/module/marketing-content/marketing-content.api.ts`, `marketing-content-form.tsx`) | Studio marketing content routes | Complete | This is the admin source of truth for many public sections. |
| Support layout (`src/app/(site)/(support)/layout.tsx`) | Every `/support/**` route | Partial | Gives all support screens the same marketing block shell, even though most page bodies are placeholders. |

<a id="shared-legal-policy-engine"></a>
### Shared Legal Policy Engine

| Shared dependency | What it affects | Status | Notes |
| --- | --- | --- | --- |
| Static policy source (`src/module/legal/policy-content.tsx`) | `/legal`, `/legal/[slug]` | Complete | All slugged legal pages render from one static content source. |
| Reusable legal renderer (`legal.content.tsx`, `legal.sidebar.tsx`, `legal.toc.tsx`) | `/legal/[slug]` | Complete | Good reuse across all policy pages. |

<a id="shared-order-detail-ui"></a>
### Shared Order Detail UI

| Shared dependency | What it affects | Status | Notes |
| --- | --- | --- | --- |
| `OrderDetailSection` + `ShipmentTrackingSection` | `/store/order/[id]`, `/account/order/[id]`, `/store/checkout/confirmation` | Complete | The same detail UI is reused consistently. |
| `OrderSummary`, `OrderTimeline`, shipment cards | Account/store/studio order views | Mostly complete | Reuse is good; a few studio actions are still non-functional. |

<a id="shared-studio-shell"></a>
### Shared Studio Shell

| Shared dependency | What it affects | Status | Notes |
| --- | --- | --- | --- |
| `(studio)` guard layout + `studio/layout.tsx` shell | All `/studio/**` pages | Complete | Shared sidebar/header shell is real and reused. |
| Sidebar navigation (`src/shared/components/layout/sidebar/sidebar.nav-items.tsx`) | Studio navigation | Partial | Contains a few links or filters that point to missing or mismatched routes. |

<a id="dead-or-mismatched-linked-routes"></a>
### Dead Or Mismatched Linked Routes

| Route or pattern | Current source | Problem | Affected areas |
| --- | --- | --- | --- |
| `/support/contact-support` | `PATH.SITE.SUPPORT.CONTACT` | No page exists; actual route is `/support/contact`. | Studio sidebar support links |
| `/newsletter` | Footer | No page exists; actual page is `/marketing/newsletter`. | Footer |
| `/studio/inventory/new` | `PATH.STUDIO.INVENTORY.NEW` | No page exists. | Studio inventory page + inventory empty state |
| `/studio/users/new` | `src/module/user-management/user.table.tsx` | No page exists. | Studio users empty state |
| `/store/products/*` | `PATH.STORE.PRODUCTS.*`, `review-form.tsx`, `product.columns.tsx` | No page family exists. | Studio product "view in store", future review success redirect |
| `/profile` | `src/module/account/account.profile.tsx` | No page exists. | Account email-change callback |
| `/orders/track`, `/support/size-guide`, `/store/new`, `/store/best-sellers`, `/store/sale`, `/store/gift-cards` | Footer | No pages exist. | Footer navigation |

## Public Site Routes

<a id="route-home"></a>
### `/`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/page.tsx` |
| Status | Mostly complete |
| Completion | 75% |
| Reuse / duplicate | Reuses [Shared Marketing Content Blocks](#shared-marketing-content-blocks) and category cards used elsewhere in store browsing. |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real page composition exists with `SiteHero`, featured categories, store categories, and CTA blocks. It is content-heavy but not empty. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Land on home and browse hero/content blocks | Working | `SiteHero` pulls `home/crousel` marketing content and the page renders several sections. | Add stronger empty states when marketing content is missing. |
| Browse featured categories | Working | `GetFeaturedCategories` fetches featured category data and links into `/store/[categorySlug]`. | Replace placeholder metadata (`Home Description`) with real copy. |
| Browse category shortcuts | Working | `ShopByCategoryGrid` renders category cards from live category data. | Add richer no-data handling when the catalog is empty. |

<a id="route-marketing-about"></a>
### `/marketing/about`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(marketing)/marketing/about/page.tsx` |
| Status | Partial |
| Completion | 40% |
| Reuse / duplicate | Near-duplicate of [`/marketing/newsletter`](#route-marketing-newsletter). |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | The outer content-block shell is real, but the core page body is still just a heading and short paragraph. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View about page shell | Working | Announcement, promo, split, CTA, offer, and feature sections are wired through marketing content. | Keep this dynamic shell. |
| Learn about the company | Partial | The body only renders `About` and a single paragraph. | Add real brand/story/team content blocks. |

<a id="route-marketing-newsletter"></a>
### `/marketing/newsletter`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(marketing)/marketing/newsletter/page.tsx` |
| Status | Partial |
| Completion | 40% |
| Reuse / duplicate | Near-duplicate of [`/marketing/about`](#route-marketing-about). Footer incorrectly links to missing `/newsletter` instead of this route. |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks), [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | Page chrome is real, but there is no newsletter form, submission handler, or subscription confirmation flow. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Read newsletter page | Working | Page renders marketing content blocks and a small intro section. | Keep content block reuse. |
| Subscribe to newsletter | Missing | No form, mutation, or service route exists on this screen. | Add an email capture form and success state. |

<a id="route-support-root"></a>
### `/support`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/page.tsx` |
| Status | Placeholder |
| Completion | 20% |
| Reuse / duplicate | Reuses [Shared Marketing Content Blocks](#shared-marketing-content-blocks) through the support layout. |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | The route renders only a `Section` with `Support Page` text; no actual support workflows are attached. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Reach support hub | Partial | Layout is styled and populated with marketing sections. | Keep shell. |
| Start a support task | Missing | No navigation blocks, forms, or ticket actions are implemented inside the page body. | Turn this into a real support entry dashboard. |

<a id="route-support-contact"></a>
### `/support/contact`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/contact/page.tsx` |
| Status | Placeholder |
| Completion | 25% |
| Reuse / duplicate | Almost identical to [`/support/returns`](#route-support-returns) and [`/support/shipping`](#route-support-shipping). |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Static title/description only; there is no form, contact channel detail, or escalation path. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View contact page | Partial | Static section renders. | Add support channels, SLA, and escalation copy. |
| Send a support request | Missing | No form or backend route exists. | Add contact/ticket submission. |

<a id="route-support-faq"></a>
### `/support/faq`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/faq/page.tsx` |
| Status | Placeholder |
| Completion | 15% |
| Reuse / duplicate | Similar placeholder depth to [`/support/help-center`](#route-support-help-center). |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | The body literally renders `<h1>{"Page"}</h1>`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Read FAQs | Missing | No FAQ items, search, or categories are present. | Build a structured FAQ dataset and accordion UI. |

<a id="route-support-help-center"></a>
### `/support/help-center`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/help-center/page.tsx` |
| Status | Placeholder |
| Completion | 15% |
| Reuse / duplicate | Same placeholder pattern as [`/support/faq`](#route-support-faq). |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | The body literally renders `<h1>{"Page"}</h1>`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Search or browse help articles | Missing | No help article model, search, or grouped links are present. | Implement real help-center content and search. |

<a id="route-support-returns"></a>
### `/support/returns`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/returns/page.tsx` |
| Status | Placeholder |
| Completion | 25% |
| Reuse / duplicate | Same page shell and metadata pattern as [`/support/contact`](#route-support-contact) and [`/support/shipping`](#route-support-shipping). |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Static contact-style copy exists, but no return workflow, eligibility checker, or return initiation flow exists. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Read returns info | Partial | Static section renders. | Replace contact copy with actual return policy summary and return actions. |
| Start a return | Missing | No route, form, or mutation exists. | Add RMA initiation flow or guide users into support tickets. |

<a id="route-support-shipping"></a>
### `/support/shipping`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/shipping/page.tsx` |
| Status | Placeholder |
| Completion | 25% |
| Reuse / duplicate | Same implementation pattern as [`/support/contact`](#route-support-contact) and [`/support/returns`](#route-support-returns). |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Static copy only; no carrier, zone, ETA, or policy detail is surfaced. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Read shipping help | Partial | Static section renders. | Replace with actual shipping FAQ, zones, ETA, and tracking entry points. |

<a id="route-support-tickets"></a>
### `/support/tickets`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/tickets/page.tsx` |
| Status | Placeholder |
| Completion | 20% |
| Reuse / duplicate | Shares the same support shell as other support pages. |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Static section only. A search for `ticket` in the codebase finds no ticket module or API beyond route constants and these pages. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| List support tickets | Missing | No ticket data model, query, or table/list implementation exists. | Add a ticket domain model and authenticated ticket list. |

<a id="route-support-ticket-detail"></a>
### `/support/tickets/[ticketId]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(support)/support/tickets/[ticketId]/page.tsx` |
| Status | Placeholder |
| Completion | 20% |
| Reuse / duplicate | Same placeholder depth as [`/support/tickets`](#route-support-tickets). |
| Depends on | [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Static section only; there is no ticket lookup by ID anywhere else in the repo. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View a support ticket | Missing | No ticket backend or detail UI exists. | Add authenticated ticket detail with status updates and comments. |

<a id="route-legal-root"></a>
### `/legal`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(legal)/legal/page.tsx` |
| Status | Placeholder |
| Completion | 30% |
| Reuse / duplicate | Reuses the same sidebar shell and metadata helpers as [`/legal/[slug]`](#route-legal-slug). |
| Depends on | [Shared Legal Policy Engine](#shared-legal-policy-engine) |
| Status reason | Layout and sidebar exist, but the main content area is empty. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Land on legal hub | Partial | Sidebar renders and policy links exist. | Populate the right column with a legal landing summary or policy cards. |

<a id="route-legal-slug"></a>
### `/legal/[slug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(site)/(legal)/legal/[slug]/page.tsx` |
| Status | Complete |
| Completion | 90% |
| Reuse / duplicate | Single reusable renderer covers all policy pages. |
| Depends on | [Shared Legal Policy Engine](#shared-legal-policy-engine) |
| Status reason | Metadata, sidebar, content, and table of contents are all driven from `policyContent`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Open a legal policy | Working | `generateMetadata`, `LegalSidebar`, `LegalContent`, and `TableOfContents` are all wired. | Add analytics or last-reviewed governance if needed. |
| Navigate between policies | Working | Sidebar links use the shared static policy map. | Consider adding a more useful `/legal` landing page as a parent summary. |

## Auth Routes

<a id="route-auth-root"></a>
### `/auth`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(auth)/auth/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses the shared auth card shell. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards) |
| Status reason | Works as a route hub that links to sign-in, sign-up, and forgot-password pages. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Choose an auth action | Working | `AuthPageComponent` renders the main auth entry cards. | Add more context or role-specific entry options if needed. |

<a id="route-auth-sign-in"></a>
### `/auth/sign-in`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(auth)/auth/sign-in/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Shares `AuthCard`, `AuthProviders`, and Better Auth client logic with other auth screens. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards), [route-api-auth](#route-api-auth) |
| Status reason | Email/password sign-in and GitHub sign-in are wired; unverified users are redirected to email verification. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Sign in with email/password | Working | `SignInForm` calls `signIn.email` and handles success/errors. | Add inline field-level error mapping if desired. |
| Sign in with GitHub | Working | `AuthProviders` lazily loads GitHub sign-in. | Add passkey provider when ready. |

<a id="route-auth-sign-up"></a>
### `/auth/sign-up`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(auth)/auth/sign-up/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same auth shell and provider stack as sign-in. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards), [route-api-auth](#route-api-auth) |
| Status reason | Email/password sign-up and GitHub sign-up are implemented and route into email verification. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Create an account | Working | `SignUpForm` calls `signUp.email`, handles success/errors, and routes to verification. | Add stronger password guidance or strength UI. |
| Review legal acceptance | Partial | Terms/privacy links exist, but there is no explicit acceptance checkbox. | Add an explicit consent checkbox if required by policy. |

<a id="route-auth-forgot-password"></a>
### `/auth/forgot-password`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(auth)/auth/forgot-password/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Reuses shared auth shell. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards), [route-api-auth](#route-api-auth) |
| Status reason | Email reset request form is wired through Better Auth. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Request reset email | Working | `ForgotPasswordForm` calls `requestPasswordReset`. | Add success explanation about expiration and spam folder. |

<a id="route-auth-reset-password"></a>
### `/auth/reset-password`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(auth)/auth/reset-password/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses shared auth shell. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards), [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | Reset form works when a token is present, but the footer help link intentionally points to `PATH.SITE.ROOT` with a TODO. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Reset password from email token | Working | Token is required, invalid state is handled, `resetPassword` is called on submit. | Fix the footer "Contact support" route. |
| Handle invalid link | Working | Renders a dedicated invalid-link card. | Add direct path to forgot-password in that state as well. |

<a id="route-auth-verify-email"></a>
### `/auth/verify-email`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(auth)/auth/verify-email/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses shared auth shell. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards), [route-api-auth](#route-api-auth) |
| Status reason | Resend flow exists and the countdown prevents rapid repeat sends. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Wait for verification | Working | Page explains the email verification step. | Add a polling or "I verified" refresh action if needed. |
| Resend verification email | Working | `sendVerificationEmail` is called after countdown. | Surface resend success/failure feedback more explicitly. |

## Store Routes

<a id="route-store-root"></a>
### `/store`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses category cards and marketing CTA blocks. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc), [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Real store landing page built from category and subcategory data. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse store by category/subcategory | Working | Server route fetches `getManyWithSubcategories` and renders category sections. | Restore commented marketing sections only if they add value. |
| Continue deeper into the catalog | Working | Cards link into category and subcategory routes. | Add empty-state messaging for a brand-new catalog. |

<a id="route-store-categories"></a>
### `/store/categories`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/categories/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same category cards used by home/store routes. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Straightforward live category listing backed by server data. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse all categories | Working | Fetches `category.getMany` and renders `CategoriesListing`. | Add category count or featured markers if useful. |

<a id="route-store-category"></a>
### `/store/[categorySlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/[categorySlug]/page.tsx` |
| Status | Mostly complete |
| Completion | 75% |
| Reuse / duplicate | Reuses subcategory cards and CTA content blocks. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc), [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Real category drilldown exists, but multiple optional page sections are commented out. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse one category's subcategories | Working | Server lookup loads category + subcategories and renders them. | Decide whether the commented banner sections should return or be removed permanently. |
| Handle unknown category | Working | Metadata generation and page rendering both call `notFound()` when data is missing. | Good as-is. |

<a id="route-store-subcategory"></a>
### `/store/[categorySlug]/[subCategorySlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/[categorySlug]/[subCategorySlug]/page.tsx` |
| Status | Mostly complete |
| Completion | 75% |
| Reuse / duplicate | Reuses product-subcategory card components and the shared store shell. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real variant listing exists, but several page-level content sections are intentionally commented out. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse variants under one subcategory | Working | Server route fetches subcategory + flattened variants and renders them with `ProductSubcategoryCards`. | Add filters/sorting once the product count grows. |
| Handle unknown subcategory | Working | Server route returns `notFound()` when the subcategory lookup fails. | Good as-is. |

<a id="route-store-pdp"></a>
### `/store/[categorySlug]/[subCategorySlug]/[variantSlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/[categorySlug]/[subCategorySlug]/[variantSlug]/page.tsx` |
| Status | Partial |
| Completion | 65% |
| Reuse / duplicate | Shares cart and wishlist state with account flows. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc), [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | Variant lookup, media, attribute switching, add-to-cart, and wishlist toggle are wired, but `Buy Now` has no handler, reviews are not rendered, and the page shows `$` pricing while the rest of the app is INR-oriented. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View PDP and switch variant attributes | Working | Variant resolution logic links between valid variant slugs. | Add more merchandising and stateful selection feedback if needed. |
| Add item to cart | Working | `AddToCartButton` uses the shared cart hook. | Provide a public cart route if guest carts are meant to be supported. |
| Buy now from PDP | Missing | The `Buy Now` button is a plain button with no click handler. | Wire it to cart + checkout or direct intent creation. |
| Read product reviews | Missing | `ProductReviews` exists as an empty component and is not rendered here. | Render reviews and connect the review API once ready. |

<a id="route-store-checkout"></a>
### `/store/checkout`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/checkout/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses shared cart, address, order, payment, and shipping option systems. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc), [route-api-razorpay-webhook](#route-api-razorpay-webhook) |
| Status reason | Sign-in guard, address selection, shipping option lookup, order creation, payment intent creation, and Razorpay checkout are all implemented. The main gap is summary accuracy: the sidebar still hardcodes free shipping and fixed tax instead of reflecting the selected shipping method and order totals. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Enter checkout as a signed-in user | Working | Route redirects anonymous users to sign-in and requires a shipping address before rendering the form. | Consider a smoother pre-checkout sign-in handoff. |
| Place an order and open Razorpay | Working | `useCheckout` creates the order, creates a payment intent, and opens `window.Razorpay`. | Add payment cancellation and retry UX. |
| Review accurate totals before paying | Partial | Summary uses fixed shipping/tax while the backend computes shipping from rate rules. | Make the summary read the selected shipping option and server-calculated totals. |

<a id="route-store-checkout-confirmation"></a>
### `/store/checkout/confirmation`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/checkout/confirmation/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Reuses [Shared Order Detail UI](#shared-order-detail-ui). |
| Depends on | [Shared Order Detail UI](#shared-order-detail-ui), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real order lookup and confirmation content exist. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Open confirmation from payment success | Working | Route reads `orderId` from query string and redirects away if absent/invalid. | Add a friendlier "cannot find order" state instead of redirect-only behavior. |
| Jump to order details or continue shopping | Working | Both CTA buttons are wired. | Good as-is. |

<a id="route-store-order-detail"></a>
### `/store/order/[id]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(store)/store/order/[id]/page.tsx` |
| Status | Complete |
| Completion | 85% |
| Reuse / duplicate | Same shared detail stack as [`/account/order/[id]`](#route-account-order-detail). |
| Depends on | [Shared Order Detail UI](#shared-order-detail-ui), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Order lookup, ownership protection, summary, item list, and shipment tracking are all wired. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View one order after purchase | Working | Server route fetches order data and renders shared order detail UI. | Good as-is. |
| Track shipment for that order | Working | `ShipmentTrackingSection` fetches shipments by order. | Could add direct carrier tracking links later. |

## Account Routes

<a id="route-account-root"></a>
### `/account`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses Better Auth session/account utilities and shared account shell. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards), [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | Profile, password/set-password, 2FA, and session management flows are real. The main bug is `changeEmail` using callback URL `/profile`, which does not exist. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Update profile details | Working | `ProfileUpdateForm` calls `updateUser` and optionally `changeEmail`. | Fix `callbackURL: "/profile"` to `/account` or a real callback route. |
| Manage password or set password | Working | Different cards are shown based on whether a credential account exists. | Good as-is. |
| Manage 2FA and sessions | Working | `TwoFactorAuthForm` and `SessionManagement` are wired. | Add recovery UX around failed 2FA setup if desired. |

<a id="route-account-cart"></a>
### `/account/cart`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/cart/page.tsx` |
| Status | Mostly complete |
| Completion | 75% |
| Reuse / duplicate | Same cart state is also used by header buttons and PDP add-to-cart. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Signed-in cart management works, but there is no equivalent public cart route even though the cart hook supports guest/session carts. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View and edit cart items | Working | `CartItemList` and `CartSummary` are wired. | Add quantity update affordances if not already in the item row UI. |
| Continue to checkout | Working | CTA links to `/store/checkout`. | Add a public cart route or explicit sign-in prompt for guest cart users. |

<a id="route-account-wishlist"></a>
### `/account/wishlist`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/wishlist/page.tsx` |
| Status | Mostly complete |
| Completion | 75% |
| Reuse / duplicate | Shares the wishlist hook with the header button and PDP wishlist toggle. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Saved-item listing and clearing flows are wired. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View saved items | Working | `WishlistItemList` reads live wishlist data. | Add filters or sorting once the list grows. |
| Move items into cart | Working | Shared wishlist API supports move-to-cart. | Consider a bulk move-to-cart action. |

<a id="route-account-orders"></a>
### `/account/order`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/order/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Uses the shared `OrderCard` and order hook. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real authenticated order history list. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse your past orders | Working | `OrderList` loads current user orders and links to detail pages. | Add filters/search once order history grows. |

<a id="route-account-order-detail"></a>
### `/account/order/[id]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/order/[id]/page.tsx` |
| Status | Complete |
| Completion | 85% |
| Reuse / duplicate | Same shared detail stack as [`/store/order/[id]`](#route-store-order-detail). |
| Depends on | [Shared Order Detail UI](#shared-order-detail-ui), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Authenticated order detail and shipment tracking are wired and protected by the customer order API. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review order contents and totals | Working | Shared order detail UI renders items, address, summary, and timeline. | Good as-is. |
| Track shipment | Working | Shipment tracking section is mounted when shipments exist. | Add invoice access once invoice route is real. |

<a id="route-account-invoice"></a>
### `/account/order/[id]/invoice`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/order/[id]/invoice/page.tsx` |
| Status | Placeholder |
| Completion | 0% |
| Reuse / duplicate | None yet. |
| Depends on | [Shared Order Detail UI](#shared-order-detail-ui) |
| Status reason | The component returns an empty `<div className="space-y-6"></div>`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View or download invoice | Missing | No invoice content, PDF generation, or actions exist. | Implement invoice rendering and download/share actions. |

<a id="route-account-payment"></a>
### `/account/payment`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/payment/page.tsx` |
| Status | Mostly complete |
| Completion | 75% |
| Reuse / duplicate | Reuses shared payment card/list components used in studio detail. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | The page builds a real payment summary per order, but it does so via sequential N+1 lookups. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review payment status per order | Working | For each order, latest payment status is fetched and normalized into `PaymentListItem`. | Replace sequential queries with a batched user-payment endpoint. |

<a id="route-account-addresses"></a>
### `/account/address`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/address/page.tsx` |
| Status | Complete |
| Completion | 85% |
| Reuse / duplicate | Shares the same address API used by checkout. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Address list, empty state, summary, delete/default management, and links into create/edit are all wired. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review saved addresses | Working | `AddressItemList` and `AddressSummary` are both live. | Good as-is. |
| Manage defaults for checkout | Working | Address summary explicitly ties defaults to checkout preselection. | Good as-is. |

<a id="route-account-address-new"></a>
### `/account/address/new`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/address/new/page.tsx` |
| Status | Complete |
| Completion | 85% |
| Reuse / duplicate | Same schema and API contract as edit. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Real creation form backed by the address contract and mutation. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Add a new address | Working | Mutation posts to `address.create` and returns to the address book on success. | Add region/country helpers if this needs broader geography support. |

<a id="route-account-address-edit"></a>
### `/account/address/[id]/edit`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/address/[id]/edit/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Same form structure as create. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Edit flow works, but `AddressEditForm` locates the address from the already-fetched address list instead of fetching by ID directly. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit a saved address | Working | Form submits `address.update` and returns to the address list. | Add a direct fetch-by-ID fallback so deep links do not depend on list cache state. |

<a id="route-account-review"></a>
### `/account/review`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/review/page.tsx` |
| Status | Placeholder |
| Completion | 10% |
| Reuse / duplicate | Tied conceptually to the unfinished review module. |
| Depends on | [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | The page explicitly says reviews will be available in a future phase. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| View your reviews | Missing | No review listing or management UI is wired. | Build user review history from `review.getMany`. |

<a id="route-account-setting"></a>
### `/account/setting`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/setting/page.tsx` |
| Status | Placeholder |
| Completion | 10% |
| Reuse / duplicate | None beyond the shared account shell. |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards) |
| Status reason | Route guard exists, but the card body is empty. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Manage account preferences | Missing | No fields or actions are implemented. | Decide whether settings live here or should be folded into `/account`. |

<a id="route-account-shipment"></a>
### `/account/shipment`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(account)/account/shipment/page.tsx` |
| Status | Mostly complete |
| Completion | 75% |
| Reuse / duplicate | Reuses shipment list/cards also used in order tracking flows. |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real shipment list exists, but it is built by loading orders and then fetching shipments per order. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review all shipments across orders | Working | Route collects all user shipments and sorts them newest-first. | Replace sequential order-by-order shipment fetches with a dedicated user shipment query. |

## Studio Routes

<a id="route-studio-root"></a>
### `/studio`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/page.tsx` |
| Status | Partial |
| Completion | 30% |
| Reuse / duplicate | Reuses [Shared Studio Shell](#shared-studio-shell). |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Auth And Role Guards](#shared-auth-and-role-guards) |
| Status reason | Access control and shell are real, but the dashboard body uses hard-coded metrics and a placeholder `1` panel instead of live analytics. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Enter studio overview | Working | Guarded route renders inside the studio shell. | Good as shell. |
| Review business metrics | Missing | Metrics are static literals, not backed by analytics APIs. | Replace with live analytics cards/charts. |

<a id="route-studio-catalog-overview"></a>
### `/studio/catalog`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/page.tsx` |
| Status | Complete |
| Completion | 85% |
| Reuse / duplicate | Reuses the shared dashboard card pattern. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Live catalog counts are fetched from `catalog.overview` and linked into management pages. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review catalog totals | Working | Stats are loaded server-side from `apiServer.catalog.overview({})`. | Add trend context or low-stock warnings if desired. |
| Jump into a catalog management area | Working | Each stat card links into the corresponding studio route. | Good as-is. |

<a id="route-studio-categories"></a>
### `/studio/catalog/categories`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/page.tsx` |
| Status | Complete |
| Completion | 90% |
| Reuse / duplicate | Uses the shared data table framework that also powers attributes/products/inventory. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Live paginated category table with list query parsing and add-category action. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse/filter categories | Working | Search, visibility, display type, featured, deleted, and pagination filters are passed into `category.getMany`. | Good as-is. |
| Start category creation | Working | CTA links into `/studio/catalog/categories/add-new-category`. | Good as-is. |

<a id="route-studio-add-category"></a>
### `/studio/catalog/categories/add-new-category`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/add-new-category/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Shares creation-form pattern with attributes/products/subcategories. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Category creation form is fully wired and protected by studio guards. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Create a category | Working | `CategoryForm` is mounted in a guarded dashboard section. | Add duplicate-slug UX if needed. |

<a id="route-studio-category-detail"></a>
### `/studio/catalog/categories/[categorySlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/[categorySlug]/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses preview card, subcategory section, and subcategory-management tools. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Good category preview and subcategory management page, but missing explicit not-found handling when the slug lookup fails. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review category details | Working | `CategoryPreviewCard` renders live category data. | Add explicit `notFound()` for missing categories. |
| Review and manage subcategories | Working | `SubCategorySection` and `ManageSubcategories` are both mounted. | Good as-is. |

<a id="route-studio-category-subcategory-table"></a>
### `/studio/catalog/categories/[categorySlug]/subcategory`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/[categorySlug]/subcategory/page.tsx` |
| Status | Complete |
| Completion | 85% |
| Reuse / duplicate | Same table infrastructure used on other studio list screens. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real filtered subcategory table scoped to one category. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse subcategories for a category | Working | Page loads category context and fetches subcategories using category slug + list query params. | Good as-is. |

<a id="route-studio-add-subcategory"></a>
### `/studio/catalog/categories/[categorySlug]/add-new-subcategory`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/[categorySlug]/add-new-subcategory/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same form workflow pattern as category/product/attribute creation. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Real create flow that redirects into the created subcategory detail page. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Create a subcategory inside a category | Working | Route requires both slug context and category ID query param and mounts `SubcategoryForm`. | Consider removing the duplicated ID query dependency by resolving the category server-side. |

<a id="route-studio-edit-category"></a>
### `/studio/catalog/categories/[categorySlug]/edit-category`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/[categorySlug]/edit-category/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same edit-form pattern as attributes/products/variants. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Route resolves the category by ID or slug and mounts a real edit form. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit category data | Working | `CategoryEditForm` is populated from live category data. | Consider simplifying the ID-or-slug lookup to one stable route contract. |

<a id="route-studio-subcategory-detail"></a>
### `/studio/catalog/categories/[categorySlug]/[subCategorySlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/[categorySlug]/[subCategorySlug]/page.tsx` |
| Status | Partial |
| Completion | 55% |
| Reuse / duplicate | Reuses the subcategory preview card. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | The preview is real, but the product listing block is an explicit TODO with placeholder text. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review subcategory metadata | Working | `SubCategoryPreviewCard` renders live subcategory data. | Good as a metadata preview. |
| Review products under that subcategory | Missing | The route includes `TODO: Add product listing component here`. | Build the product list and related actions here. |

<a id="route-studio-edit-subcategory"></a>
### `/studio/catalog/categories/[categorySlug]/[subCategorySlug]/edit-subcategory`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/[categorySlug]/[subCategorySlug]/edit-subcategory/page.tsx` |
| Status | Placeholder |
| Completion | 10% |
| Reuse / duplicate | Very similar debug-shell behavior to [`/studio/catalog/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]`](#route-studio-series-detail). |
| Depends on | [Shared Studio Shell](#shared-studio-shell) |
| Status reason | The page only prints the slug params and an empty right column. There is no edit form or data fetch. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit a subcategory | Missing | No edit UI or mutation exists on this page. | Replace with a real subcategory edit form using the existing schema/API. |

<a id="route-studio-series-detail"></a>
### `/studio/catalog/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]/page.tsx` |
| Status | Placeholder |
| Completion | 0% |
| Reuse / duplicate | Same debug-shell style as the edit-subcategory route. |
| Depends on | [Shared Studio Shell](#shared-studio-shell) |
| Status reason | The route only echoes slug params and leaves the main content empty. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Manage a series-level grouping | Missing | No series model, fetch, or action exists anywhere else in the repo. | Either remove this route or implement the missing series domain. |

<a id="route-studio-attributes"></a>
### `/studio/catalog/attributes`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/attributes/page.tsx` |
| Status | Complete |
| Completion | 90% |
| Reuse / duplicate | Same data-table pattern as categories/products/inventory. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Live list route with search, type, and has-values filters. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse/filter attributes | Working | Attribute table is fed from `attribute.getMany` with list-query parsing. | Good as-is. |
| Start attribute creation | Working | CTA links to add-new-attribute. | Good as-is. |

<a id="route-studio-add-attribute"></a>
### `/studio/catalog/attributes/add-new-attribute`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/attributes/add-new-attribute/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same form workflow pattern as categories/products. |
| Depends on | [Shared Studio Shell](#shared-studio-shell) |
| Status reason | Real attribute creation form backed by `attribute.create`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Create a reusable attribute | Working | Form posts title, slug, type, value, and display order to the API. | Good as-is. |

<a id="route-studio-attribute-detail"></a>
### `/studio/catalog/attributes/[attributeSlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/attributes/[attributeSlug]/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Reuses `AttributePreviewCard` and the shared detail-shell pattern used across studio resources. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real preview page with edit action and server-side slug lookup. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review one attribute | Working | Route fetches by slug and renders a preview card. | Good as-is. |

<a id="route-studio-edit-attribute"></a>
### `/studio/catalog/attributes/[attributeSlug]/edit-attribute`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/attributes/[attributeSlug]/edit-attribute/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same edit-form pattern as category/product/variant editing. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Route resolves the attribute by ID, validates the slug match, and renders `AttributeEditForm`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit attribute data | Working | Live attribute data is loaded and posted back through `attribute.update`. | Good as-is. |

<a id="route-studio-products"></a>
### `/studio/catalog/products`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/products/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Same table framework as categories/attributes/inventory. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | Product list, search, status/category filters, and edit/delete actions are real. The main gap is that product table "view in store" URLs are based on the missing `/store/products/*` route family. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse/filter products | Working | Server route passes search/status/category filters into `product.getMany`. | Good as-is. |
| Open a product in the storefront from the table | Broken | `product.columns.tsx` builds store URLs from `PATH.STORE.PRODUCTS.ROOT`, which has no matching page route. | Replace with the real PDP route structure. |

<a id="route-studio-add-product"></a>
### `/studio/catalog/products/add-new-product`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/products/add-new-product/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same form + preview-tab pattern used in no other area yet; this is the strongest creation form in the repo. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Product form is wired with category/subcategory selects, SEO fields, features, status, image upload, and a live preview tab. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Create a product draft/live record | Working | `ProductForm` posts a full product payload into `product.create`. | Good as-is. |

<a id="route-studio-product-detail"></a>
### `/studio/catalog/products/[productSlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/products/[productSlug]/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses product preview and variant section components. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Product preview and variant list are real, but the page does not explicitly `notFound()` on missing products. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review one product | Working | Product + variants are fetched together and rendered with preview + variant list. | Add explicit not-found handling. |
| Start variant creation | Working | CTA links to add-new-variant with product ID in query. | Good as-is. |

<a id="route-studio-edit-product"></a>
### `/studio/catalog/products/[productSlug]/edit-product`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/products/[productSlug]/edit-product/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same edit-form pattern as categories/attributes/variants. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Product edit form is fully wired from live data. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit a product | Working | Route resolves the product and posts updates through `product.update`. | Good as-is. |

<a id="route-studio-add-variant"></a>
### `/studio/catalog/products/[productSlug]/add-new-variant`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/products/[productSlug]/add-new-variant/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same variant form structure as edit. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Variant creation form is wired with attributes, media, and inventory creation. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Create a product variant | Working | Route resolves product context, loads default attributes, and mounts `VariantForm`. | Good as-is. |

<a id="route-studio-variant-detail"></a>
### `/studio/catalog/products/[productSlug]/[variantSlug]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/products/[productSlug]/[variantSlug]/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Same preview-shell pattern as other studio detail pages. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Variant details, inventory summary, attributes, media, and edit CTA are all real. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review one variant | Working | Page resolves variant by slug and renders detail cards and badges. | Good as-is. |

<a id="route-studio-edit-variant"></a>
### `/studio/catalog/products/[productSlug]/[variantSlug]/edit-variant`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/catalog/products/[productSlug]/[variantSlug]/edit-variant/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same form structure as add-new-variant. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Edit flow resolves variant/product/default attributes and posts a full update payload. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit a variant | Working | Form handles media, attributes, and inventory in one route. | Good as-is. |

<a id="route-studio-inventory"></a>
### `/studio/inventory`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/inventory/page.tsx` |
| Status | Partial |
| Completion | 65% |
| Reuse / duplicate | Same table-shell pattern as other studio list routes. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | Inventory list and filters are real, but both the page CTA and the empty state point to missing `/studio/inventory/new`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse/filter inventory | Working | `inventory.getMany` supports stock status, reserved/incoming, and warehouse filters. | Good as list view. |
| Create a new inventory record from this screen | Broken | CTA points to a route that does not exist. | Add the route or remove the CTA. |

<a id="route-studio-inventory-detail"></a>
### `/studio/inventory/[inventoryId]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/inventory/[inventoryId]/page.tsx` |
| Status | Partial |
| Completion | 70% |
| Reuse / duplicate | Reuses inventory view, movements, and delete components. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real detail page exists, but it does not explicitly handle missing inventory records with `notFound()`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review one inventory item | Working | View card and movement history are rendered from live API data. | Add explicit missing-record handling. |
| Delete inventory record | Working | `InventoryDelete` is mounted when data exists. | Consider a stronger empty/error state when data is absent. |

<a id="route-studio-inventory-edit"></a>
### `/studio/inventory/[inventoryId]/edit-inventory`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/inventory/[inventoryId]/edit-inventory/page.tsx` |
| Status | Partial |
| Completion | 70% |
| Reuse / duplicate | Same edit-shell pattern as other studio edit routes. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | The edit form is real, but missing-record handling is weak and the "Save Draft" button is present without draft behavior. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit inventory counts and identifiers | Working | `InventoryEditForm` posts through `inventory.update`. | Add explicit `notFound()` and either wire or remove "Save Draft". |

<a id="route-studio-orders"></a>
### `/studio/orders`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/orders/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Same table framework as other admin resources. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real admin order list with search/status/customer-type filtering. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse and filter all orders | Working | Route passes status/customer-type/search filters into `order.getManyAdmin`. | Good as-is. |

<a id="route-studio-order-detail"></a>
### `/studio/orders/[orderId]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/orders/[orderId]/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Strongest use of the shared order/shipment UI stack in the repo. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Order Detail UI](#shared-order-detail-ui), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Comprehensive detail route with order overview, items, timeline, payment, shipment creation/status, notes, customer info, and address cards. Several header actions remain inert. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review and manage an order | Working | Detail route stitches together many real components and APIs. | Good foundation. |
| Send/print invoice or open more actions | Missing | `OrderOverviewCard` renders buttons with no handlers. | Either wire the actions or hide them until ready. |

<a id="route-studio-payments"></a>
### `/studio/payment`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/payment/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same data-table pattern as other studio list routes. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real payment list with status/provider filters. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse and filter payments | Working | Route parses status/provider filters and fetches `payment.getManyAdmin`. | Good as-is. |

<a id="route-studio-payment-detail"></a>
### `/studio/payment/[paymentId]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/payment/[paymentId]/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Reuses payment overview/metadata cards from the payment module. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real detail view with provider metadata and linked-order navigation. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review one payment record | Working | Page fetches payment by ID and renders status/provider/metadata. | Good as-is. |

<a id="route-studio-shipping"></a>
### `/studio/shipping`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/shipping/page.tsx` |
| Status | Mostly complete |
| Completion | 85% |
| Reuse / duplicate | Same list-shell pattern as payments/orders/inventory. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Real shipment list with status/carrier/order filters. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse and filter shipments | Working | Route passes filters into `shipment.getMany`. | Good as-is. |

<a id="route-studio-shipping-detail"></a>
### `/studio/shipping/[shippingId]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/shipping/[shippingId]/page.tsx` |
| Status | Complete |
| Completion | 90% |
| Reuse / duplicate | Reuses shipment timeline, badge, and status form also used in order detail. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Strong detail page with shipment metadata, linked order, status timeline, and status update form. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review shipment state | Working | Page fetches shipment by ID and renders a full detail view. | Good as-is. |
| Update tracking and status | Working | `ShipmentStatusForm` is wired directly into the page. | Good as-is. |

<a id="route-studio-users"></a>
### `/studio/users`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/users/page.tsx` |
| Status | Partial |
| Completion | 70% |
| Reuse / duplicate | Same table-shell pattern as other admin list views. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Auth And Role Guards](#shared-auth-and-role-guards), [Dead Or Mismatched Linked Routes](#dead-or-mismatched-linked-routes) |
| Status reason | User list, role filter, and admin guard are real, but `banned` and `emailVerified` are parsed in the route and then ignored, and the empty state points to missing `/studio/users/new`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse users | Working | Admin-only user list renders through `getStudioUsers`. | Good base. |
| Filter by banned/email verified | Broken | The page computes `banned` and `emailVerified` but never sends them to `getStudioUsers`. | Wire those filters through the server action and auth query. |
| Create a new user from the empty state | Broken | Empty state CTA points to a missing route. | Add the route or remove the CTA. |

<a id="route-studio-user-detail"></a>
### `/studio/users/[userId]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/users/[userId]/page.tsx` |
| Status | Mostly complete |
| Completion | 80% |
| Reuse / duplicate | Reuses role/bulk action helpers from the user-management module. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Auth And Role Guards](#shared-auth-and-role-guards) |
| Status reason | Admin-only detail page with role assignment, ban/unban actions, and effective permission display. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Review and manage one user | Working | Route loads managed user data, renders badges, role form, row actions, and permissions. | Good as-is. |

<a id="route-studio-marketing-redirect"></a>
### `/studio/marketing`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/marketing/page.tsx` |
| Status | Redirect / Fallback |
| Completion | 100% |
| Reuse / duplicate | Redirect-only route. |
| Depends on | [Shared Studio Shell](#shared-studio-shell) |
| Status reason | The page intentionally redirects to `/studio/marketing/content`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Open marketing root | Working | Route immediately redirects to the content page. | Good as-is. |

<a id="route-studio-marketing-content"></a>
### `/studio/marketing/content`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/marketing/content/page.tsx` |
| Status | Complete |
| Completion | 90% |
| Reuse / duplicate | Same data-table pattern as other admin list screens. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Marketing Content Blocks](#shared-marketing-content-blocks) |
| Status reason | Real content-block management list with page/section/active filters. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Browse/filter marketing blocks | Working | Route sends page/section/isActive filters into `marketingContent.getMany`. | Good as-is. |
| Start new content creation | Working | CTA links to `/studio/marketing/content/new`. | Good as-is. |

<a id="route-studio-marketing-content-new"></a>
### `/studio/marketing/content/new`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/marketing/content/new/page.tsx` |
| Status | Complete |
| Completion | 90% |
| Reuse / duplicate | Same form shell as edit. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Marketing Content Blocks](#shared-marketing-content-blocks), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Real creation form supports standard blocks and carousel slides. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Create a marketing content block | Working | Form posts through `marketingContent.create` and supports section-specific fields. | Good as-is. |

<a id="route-studio-marketing-content-edit"></a>
### `/studio/marketing/content/[id]/edit`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/marketing/content/[id]/edit/page.tsx` |
| Status | Complete |
| Completion | 90% |
| Reuse / duplicate | Same form shell as new. |
| Depends on | [Shared Studio Shell](#shared-studio-shell), [Shared Marketing Content Blocks](#shared-marketing-content-blocks), [route-api-blob-upload](#route-api-blob-upload) |
| Status reason | Route loads content by ID and feeds normalized default values into the same reusable form. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Edit a marketing content block | Working | Route fetches content, maps defaults, and submits `marketingContent.update`. | Good as-is. |

<a id="route-studio-catchall"></a>
### `/studio/[...catchAll]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/(studio)/studio/[...catchAll]/page.tsx` |
| Status | Redirect / Fallback |
| Completion | 100% |
| Reuse / duplicate | Uses the shared studio not-found handling flow. |
| Depends on | [Shared Studio Shell](#shared-studio-shell) |
| Status reason | The route intentionally calls `notFound()` for unmatched studio paths. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Visit an unknown studio route | Working | Catch-all page immediately triggers Next.js not-found behavior. | Good as-is. |

## Service Routes

<a id="route-api-trpc"></a>
### `/api/v1/[[...rest]]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/api/v1/[[...rest]]/route.ts` |
| Status | Complete |
| Completion | 90% |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Central tRPC transport is configured with hydration context and development error logging. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Serve tRPC queries and mutations | Working | `fetchRequestHandler` is wired for both GET and POST. | Good as-is. |

<a id="route-api-auth"></a>
### `/api/auth/[...all]`

| Item | Detail |
| --- | --- |
| Route file | `src/app/api/auth/[...all]/route.ts` |
| Status | Partial |
| Completion | 75% |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards) |
| Status reason | Better Auth integration is real and POST requests are passed through Arcjet, but the Arcjet path checks only target URLs ending in `/auth/sign-in` and `/auth/sign-up`, which should be confirmed against the actual provider-specific auth endpoints Better Auth uses. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Serve auth requests | Working | Route delegates to `toNextJsHandler(auth)`. | Good base. |
| Protect sign-in and sign-up traffic | Partial | Arcjet guard exists, but path matching may be too narrow. | Verify and broaden path matching if necessary. |

<a id="route-api-blob-upload"></a>
### `/api/blob/upload`

| Item | Detail |
| --- | --- |
| Route file | `src/app/api/blob/upload/route.ts` |
| Status | Partial |
| Completion | 70% |
| Depends on | [Shared Auth And Role Guards](#shared-auth-and-role-guards) |
| Status reason | Authenticated uploads work, but there is no explicit file size/type validation beyond presence of `file`. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Upload an asset | Working | Authenticated POST accepts form-data and writes to Vercel Blob. | Add MIME/size limits and better error detail. |

<a id="route-api-order-legacy"></a>
### `/api/order`

| Item | Detail |
| --- | --- |
| Route file | `src/app/api/order/route.ts` |
| Status | Redirect / Fallback |
| Completion | 100% |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Route is intentionally retired and returns `410` with instructions to use tRPC procedures instead. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Call legacy order endpoint | Working as deprecation | Both GET and POST explicitly return deprecation errors. | Good as-is until the route is removed entirely. |

<a id="route-api-razorpay-webhook"></a>
### `/api/webhooks/razorpay`

| Item | Detail |
| --- | --- |
| Route file | `src/app/api/webhooks/razorpay/route.ts` |
| Status | Mostly complete |
| Completion | 85% |
| Depends on | [Shared Commerce State And tRPC](#shared-commerce-state-and-trpc) |
| Status reason | Signature verification, payment reconciliation, order status updates, and order confirmation notifications are wired. |

| Flow | Status | Reason / evidence | Improvement |
| --- | --- | --- | --- |
| Reconcile captured payment | Working | Webhook finds the payment row, marks it completed, updates the order to `paid`, and sends confirmation email. | Good as-is. |
| Reconcile failed payment | Working | Pending payments are marked failed when Razorpay sends `payment.failed`. | Add more metrics/alerting if failures matter operationally. |

## Fallback And Utility Screens

These are not normal business routes, but they are user-visible screens that affect the experience.

| Screen file | Status | Completion | Notes |
| --- | --- | ---: | --- |
| `src/app/loading.tsx` | Mostly complete | 85% | Good global loading shell with header. |
| `src/app/error.tsx` | Mostly complete | 85% | Strong global error diagnostics with copy/retry. |
| `src/app/forbidden.tsx` | Mostly complete | 85% | Clear access-denied screen. |
| `src/app/(auth)/auth/loading.tsx` | Mostly complete | 85% | Good auth-loading card. |
| `src/app/(site)/loading.tsx` | Mostly complete | 85% | Lightweight site loader. |
| `src/app/(site)/not-found.tsx` | Mostly complete | 85% | Basic but clear site 404. |
| `src/app/(store)/store/checkout/confirmation/loading.tsx` | Mostly complete | 85% | Strong loading skeleton for confirmation detail. |
| `src/app/(store)/store/not-found.tsx` | Mostly complete | 85% | Basic store 404. |
| `src/app/(studio)/loading.tsx` | Mostly complete | 85% | Route-group-level studio loader; similar to inner studio loader. |
| `src/app/(studio)/studio/loading.tsx` | Mostly complete | 85% | Inner studio loader; functionally duplicate with route-group loader. |
| `src/app/(studio)/studio/error.tsx` | Complete | 90% | Strong studio error diagnostics with retry/copy stack. |
| `src/app/(studio)/studio/forbidden.tsx` | Complete | 90% | Good studio-specific forbidden screen. |
| `src/app/(studio)/studio/not-found.tsx` | Complete | 90% | Good studio-specific 404. |

## Cross-Cutting Summary

| Area | Current state | Main next step |
| --- | --- | --- |
| Public marketing/support | Public site shell is real, but many marketing/support pages are still placeholders. | Replace static headings with real content models and workflows. |
| Commerce | Catalog, cart, checkout, orders, payments, and shipments are largely implemented. | Fix the PDP "Buy Now" gap, checkout summary mismatch, and the lack of a public cart route. |
| Account | Profile/address/order/shipment/payment routes are useful today. | Finish invoice, review, and settings screens; fix callback route mismatches. |
| Studio | CRUD depth is strong across catalog, orders, shipping, payments, users, and marketing content. | Replace remaining placeholder routes and repair dead links/ignored filters. |
| Routing hygiene | Several configured or linked paths have no screen. | Fix the mismatched route constants and footer/sidebar links. |

