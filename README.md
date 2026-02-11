# E‑Commerce CMS & Admin – Workflow Report

This document summarizes the current state of the application as implemented in `src/`.
It focuses on **route-based, workflow-based** behavior and estimates **production readiness (%)** for each flow.

> **Note**: Percentages are approximate and based only on the existing code – not on any external spec.

---

## 1. Architecture Overview

- **Framework**
  - Next.js App Router (`src/app`)
  - TypeScript
- **Backend / API**
  - tRPC (`src/core/api`)
  - Central router: `appRouter` in `src/core/api/api.routes.ts`
  - Context + middleware with auth/session in `src/core/api/api.methods.ts`
- **Database**
  - Neon serverless Postgres (`@neondatabase/serverless`)
  - Drizzle ORM (`drizzle-orm/neon-serverless`)
  - Schema in `src/core/db/db.schema.ts`
- **Auth**
  - `better-auth` with Drizzle adapter (`src/core/auth/auth.ts`)
  - Email+password, email verification, password reset
  - Social (GitHub), 2FA, Passkeys, admin plugin
- **Domain Modules** (`src/module`)
  - `auth`, `account`, `user`
  - `product`, `product-variant`, `category`, `subcategory`, `series`, `inventory`
  - `cart`, `wishlist`, `address`
  - `legal`, `cookies`, `site`, `attribute`
- **UI & Layout**
  - Route groups: `(site)`, `(store)`, `(auth)`, `(account)`, `(studio)` in `src/app`
  - Shared components in `src/shared/components/**`
  - Central routes config in `src/shared/config/routes.ts`

Overall this is a **modular, domain-driven app** with clear separation between core, modules, shared, and app routes.

---

## 2. Actors & High‑Level Areas

- **Guest** (unauthenticated visitor)
  - Landing site, marketing, legal, support
  - Browse catalog (categories, subcategories, products)
  - View product detail
  - Start auth flows (sign in / sign up / reset / verify)
- **Authenticated User** (customer)
  - Manage profile & account
  - Commerce area: cart, wishlist, orders, addresses, reviews, shipments, payments
- **Admin / Studio User**
  - Studio dashboard
  - Product & catalog management
  - Inventory management
  - Future: orders, customers, discounts, shipping, payments, marketing, analytics, settings

Percentages below are **per‑flow estimates** based on implementation depth: API + UI + auth/guards + basic UX.

---

## 3. Guest Flows

### 3.1 Site & Marketing

**Routes** (from `PATH.SITE` and `src/app/(site)`):

- `/` (site home – `src/app/(site)/page.tsx`)
- `/about`
- `/support/*` (contact, FAQ, help center, etc.)
- `/legal/*` (terms, privacy, refund, shipping, etc.)

**Implementation evidence**

- Layout and sections in `src/shared/components/layout/**`.
- Example page implementations (e.g. marketing, support, legal) render content sections with metadata.

**Production readiness**: **~80%**

- **Strengths**: Structure, layouts, and content placeholders are in place; routing is clear and consistent.
- **Gaps**: Content likely needs final copy, SEO polish, analytics, and accessibility review.

---

### 3.2 Guest Catalog Browsing

**Routes** (from `PATH.STORE` and `src/app/(store)`):

- `/store` – store home
- `/store/categories`
- `/store/:categorySlug` (category)
- `/store/:categorySlug/:subcategorySlug` (subcategory)
- `/store/products` and `/store/products/:productId`

**Implementation evidence**

- `src/app/(store)/store/page.tsx`:
  - Calls `apiServer.category.getManyWithSubcategories({ query: {} })`.
  - Renders cards for subcategories with image, title, and description.
  - Links to category and subcategory routes from `PATH.STORE`.
- Backend:
  - `categoryRouter.getManyWithSubcategories` in `src/module/category/category.api.ts` with filters and Drizzle queries.
  - `productRouter` in `src/module/product/product.api.ts` with multiple read endpoints.

**Production readiness**: **~85%**

- **Strengths**: End‑to‑end data flow from DB → tRPC → UI; clean cards; routing in place.
- **Gaps**: Edge cases (empty states, error handling, loading states for all routes) may still need refinement; full product detail page not inspected but APIs exist.

---

### 3.3 Guest Product Detail View

**Routes** (likely):

- `/store/products/:productId` or slug-based routes.

**Implementation evidence**

- `productRouter.getBySlug` and `get` in `src/module/product/product.api.ts`.
- `productContract` in `src/module/product/product.schema.ts` defines shapes.

**Production readiness**: **~70%**

- **Strengths**: Solid backend read APIs with filters and error handling.
- **Gaps**: UI detail page implementation not fully inspected; probably present but may lack advanced states (reviews, upsell, etc.).

---

### 3.4 Guest Checkout Start (Cart/Checkout as Guest)

**Routes**

- `/store/checkout` – `src/app/(store)/store/checkout/page.tsx`

**Implementation evidence**

- The current `checkout` page is a **generic Section with static “Contact Support” content**.
- No visible linkage to cart state or order placement logic.

**Production readiness**: **~20%**

- **Strengths**: Route and layout placeholder are present.
- **Gaps**: Real checkout UX, payment integration, address/summary, validation, and error handling are not implemented here.

---

## 4. Auth Flows (Guest → User)

Routes in `PATH.AUTH` and `src/app/(auth)/auth/*`:

- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/verify-email`

**Implementation evidence**

- `better-auth` config in `src/core/auth/auth.ts`:
  - Email+password with email verification and reset flows.
  - Social (GitHub) provider.
  - 2FA, passkeys, admin support.
- UI module: `src/module/auth/*`:
  - `auth.sign-in.tsx`, `auth.sign-up.tsx`, `auth.forgot-password.tsx`, `auth.reset-password.tsx`, `auth.verify-email.tsx`, providers and buttons.
- Pages:
  - `src/app/(auth)/auth/sign-in/page.tsx` – uses `SignInForm`, `AuthProviders`, redirects if already signed in.
  - `src/app/(auth)/auth/sign-up/page.tsx` – similar pattern.

**Production readiness**: **~90%**

- **Strengths**: Full stack auth solution with advanced features (2FA, passkey); polished UI forms; proper redirects based on session.
- **Gaps**: UX polish around error messages, rate limiting UX, and two‑factor flows may still need validation in practice.

---

## 5. Authenticated User Flows (Customer)

### 5.1 Account – Profile & Security

**Routes** (`PATH.ACCOUNT` + `src/app/(account)/account/(user)`):

- `/account/user` (overview)
- `/account/user/profile`
- `/account/user/security`
- `/account/user/sessions`
- `/account/user/settings`

**Implementation evidence**

- `profile` page: `src/app/(account)/account/(user)/user/profile/page.tsx`:
  - Requires session via `getServerSession`; redirects to `/` if unauthenticated.
  - Uses `AccountSidebar`, `ProfileUpdateForm`, `ProfileCard`.
- Security/sessions/settings pages follow a similar structural pattern (not all opened, but routes exist and use shared layout).

**Production readiness**: **~80%**

- **Strengths**: Auth‑guarded, modular components, integration with auth user object, clear UX.
- **Gaps**: Details of update workflows (e.g. email change, password change, session revocation) need per‑component review; probably implemented but may need more validation.

---

### 5.2 Account – Commerce Area (Cart, Wishlist, Orders, Address, Review, Shipment)

**Routes**

- `/account/commerce` root
- `/account/commerce/cart`
- `/account/commerce/wishlist`
- `/account/commerce/order`
- `/account/commerce/address`
- `/account/commerce/review`
- `/account/commerce/shipment`

**Backend evidence**

- `cartRouter` in `src/module/cart/cart.api.ts`:
  - `getUserCart`: fetches user cart and lines with variant + product.
  - `addItem`: creates cart if missing, upserts cart line with quantity and price snapshot.
- `wishlistRouter`, `addressRouter` exist in `api.routes.ts` and their module folders.

**UI evidence**

- `cart` page: `src/app/(account)/account/(commerce)/commerce/cart/page.tsx`:
  - Session guard.
  - Renders layout and `CommerceSidebar`, but **cart `CardContent` is empty** (no lines, totals, or actions rendered yet).

**Production readiness (per sub‑flow)**

- **View & manage cart**: **~40%**
  - Backend is strong; UI is scaffolded but not wired to cart data.
- **Wishlist**: **~50–60%** (assumed similar pattern; code not fully opened).
- **Orders, Addresses, Reviews, Shipments**: **~30–50%**
  - Routes and modules exist; some APIs implemented; UI likely partial.

Overall commerce account area: **~45–55%** for a polished production experience.

---

### 5.3 User Checkout (Authenticated)

**Routes**

- Likely reuse `/store/checkout` plus `/account/commerce/payment`.
- `src/app/(account)/account/(commerce)/commerce/payment/page.tsx` exists (not opened here).

**Production readiness**: **~30–40%**

- **Strengths**: Domain entities (cart, address, inventory) exist; APIs can support checkout.
- **Gaps**: Visible checkout UX is still placeholder‑level; payment logic and order creation are not clearly wired from the pages inspected.

---

## 6. Admin / Studio Flows

### 6.1 Studio Dashboard & Access

**Routes**

- `/studio` – root studio dashboard.

**Implementation evidence**

- `src/app/(studio)/studio/page.tsx` (not fully opened here but present) with dashboard layout components.
- All studio pages use `getServerSession` and redirect to `/` if unauthenticated.
- `better-auth` admin plugin configured in `src/core/auth/auth.ts` (roles and access control defined), although per‑route role enforcement is applied mainly via server checks and possibly tRPC middleware.

**Production readiness**: **~75%**

- **Strengths**: Auth + role system, dashboard layouts, and core management flows present.
- **Gaps**: Fine‑grained role checks per resource and UX safeguards may need more work.

---

### 6.2 Product & Catalog Management

**Routes** (`PATH.STUDIO.PRODUCTS`, `CATEGORIES`, `SUB_CATEGORIES`, `SERIES`):

- `/studio/products` (list)
- `/studio/products/new` (create)
- `/studio/products/:slug` (view)
- `/studio/products/:slug/edit?id=...` (edit)
- `/studio/products/categories` + nested category / subcategory / series CRUD routes.

**Implementation evidence**

- `src/app/(studio)/studio/products/new/page.tsx`:
  - Session guard.
  - Renders `ProductForm` inside dashboard layout; uses `HydrateClient` to enable tRPC queries/mutations.
- `productRouter` in `src/module/product/product.api.ts` with extensive query endpoints.
- Category, subcategory, and series routers for hierarchical catalog management.

**Production readiness**: **~75–80%**

- **Strengths**: Deep backend coverage and functional create/edit UIs; studio pages are wired to domain modules.
- **Gaps**: Bulk actions, advanced validation, preview/versioning, and error states may still be missing.

---

### 6.3 Inventory Management

**Routes** (`PATH.STUDIO.INVENTORY`):

- `/studio/products/inventory`
- `/studio/products/inventory/new`
- `/studio/products/inventory/:id`
- `/studio/products/inventory/:id/edit`

**Implementation evidence**

- `src/app/(studio)/studio/products/inventory/page.tsx`:
  - Session guard.
  - Calls `apiServer.inventory.getMany({ query: {} })`.
  - Renders `InventorySection` with returned data inside dashboard layout.
- `inventoryRouter` in `src/module/inventory/inventory.api.ts` provides backend logic.

**Production readiness**: **~70–75%**

- **Strengths**: End‑to‑end listing established; data table/component for inventory.
- **Gaps**: Create/edit flows (`NEW`, `EDIT`) may not be fully implemented in UI; advanced features like stock movements, logging, and bulk imports are unknown.

---

### 6.4 Orders, Customers, Discounts, Shipping, Payments, Marketing, Analytics, Settings

**Routes** (`PATH.STUDIO`):

- Orders: `/studio/orders`, `/studio/orders/:id`
- Customers: `/studio/customers`, `/studio/customers/:id`
- Discounts: `/studio/discounts`, `/studio/discounts/new`, `/studio/discounts/:id/edit`
- Shipping: `/studio/shipping`, `/studio/shipping/:id/edit`
- Payments: `/studio/payments`, `/studio/payments/:id`
- Marketing: `/studio/marketing`, `/studio/marketing/campaigns`
- Analytics: `/studio/analytics`, `/studio/analytics/sales`, `/studio/analytics/customers`
- Settings: `/studio/settings`, `/studio/settings/profile`, `/studio/settings/team`

**Implementation evidence**

- Routes are fully defined in `PATH.STUDIO`.
- Not all corresponding pages/components have been inspected; some may still be stubs or not yet created.
- Domain modules for orders/customers/discounts based on code scanning are less prominent than products/inventory.

**Production readiness (average across these sub‑areas)**: **~40–50%**

- **Strengths**: Route architecture and intent are clear; foundations (auth, DB, tRPC) are ready to support these features.
- **Gaps**: Many flows are likely partial or not yet implemented in UI or backend; real reporting/analytics and marketing logic will need significant work.

---

## 7. Cross‑Cutting Concerns

- **Error Handling**
  - tRPC error formatter wraps Zod errors into `API_RESPONSE` with structured error objects.
  - API handlers log errors via `debugError` and `debugLog` utilities.
- **Validation**
  - Strong Zod schemas in contracts (e.g. `productContract`, `categoryContract`).
- **Security & Auth**
  - Per‑page session checks for account and studio routes.
  - BetterAuth configuration with roles/admin and 2FA/passkeys.
- **Testing & Observability**
  - No explicit tests found under `src/`.
  - Logging is present; metrics/monitoring are not visible in code.

Approximate cross‑cutting readiness: **~60–70%** (good foundations, but tests and monitoring still needed for production hardening).

---

## 8. Summary Table

| Area / Flow                                     | Actor      | Approx. % | Notes                                                |
| ----------------------------------------------- | ---------- | --------- | ---------------------------------------------------- |
| Site & marketing pages                          | Guest      | ~80%      | Layout+routes ready; content/SEO polish pending.     |
| Catalog browsing (categories/subcategories)     | Guest      | ~85%      | Full data flow and UI cards in place.                |
| Product detail                                  | Guest      | ~70%      | Backend solid; UI not fully reviewed.                |
| Guest checkout page                             | Guest      | ~20%      | Placeholder content; real checkout missing.          |
| Auth (sign in/up, reset, verify, social, 2FA)   | Guest/User | ~90%      | BetterAuth + rich UI components.                     |
| Account profile/security/sessions/settings      | User       | ~80%      | Guarded pages with real forms and components.        |
| Commerce account (cart, wishlist, orders, etc.) | User       | ~45–55%   | Strong backend; UI partial (cart page mostly empty). |
| User checkout (authenticated)                   | User       | ~30–40%   | Domain ready; UI/payment flows incomplete.           |
| Studio dashboard & access                       | Admin      | ~75%      | Auth+roles+layouts; good base.                       |
| Product & catalog management                    | Admin      | ~75–80%   | Product form & APIs complete; advanced UX TBD.       |
| Inventory management                            | Admin      | ~70–75%   | Listing solid; create/edit flows TBD.                |
| Orders/customers/discounts/shipping/payments    | Admin      | ~40–50%   | Routes planned; implementations partially present.   |
| Marketing & analytics                           | Admin      | ~40–50%   | Intent clear in routes; deeper features TBD.         |

---

## 9. Next Steps Toward Production

Based on the current codebase, the most impactful work for a production‑ready v1 would be:

1. **Checkout & Orders**
   - Implement full checkout flow (cart summary → address → payment → order confirmation).
   - Integrate payment provider and persist orders.
2. **Commerce Account UIs**
   - Wire cart, wishlist, orders, and addresses pages to their APIs with robust UX.
3. **Admin Operations**
   - Complete CRUD and guardrails for orders, customers, discounts, shipping, and payments.
4. **Testing & Observability**
   - Add unit/integration tests around critical flows (auth, checkout, product creation).
   - Add logging/monitoring hooks for production debugging.

This README should serve as a high‑level map so you can track each workflow to 100% as you continue building.
