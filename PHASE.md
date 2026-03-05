# E-Commerce Platform — Phase Execution Plan

> **Generated:** 2026-03-05  
> **Platform:** Single-Merchant Enterprise Commerce  
> **Stack:** Next.js 16 · tRPC · Drizzle ORM · Neon Postgres · Better Auth · Radix UI · Tailwind CSS v4  
> **Overall Completion:** ~75%

---

## How to Read This Document

- Each **phase** focuses on **one primary module** (or a tightly related pair)
- Phases are ordered by **dependency** — earlier phases must be done before later ones
- Phases 1–23 cover **MVP** scope; Phases 24–31 are **Post-MVP / Enterprise**
- The **Progress Table** at the bottom tracks every module and phase at a glance

### Legend

| Icon | Meaning |
|------|---------|
| ✅ | Complete — fully implemented and functional |
| 🟡 | Partial — scaffolded or partially working, needs more work |
| ❌ | Not Started — route/schema may exist but no real logic |

### Dependency Chain (Critical Path)

```
Phase 1 (Foundation) ──► Phase 2 (Auth) ──► Phase 3 (Shared UI)
       │
       ▼
Phase 4 (Category) ──► Phase 5 (Subcategory) ──► Phase 6 (Series)
       │                                               │
       │                                               ▼
       │                                        Phase 7 (Attribute)
       │
       ▼
Phase 8 (Product) ──► Phase 9 (Product Variant) ──► Phase 10 (Inventory)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       Phase 13 (Cart)  Phase 14 (Wishlist)  Phase 11 (Account)
              │                                    │
              │                              Phase 12 (Address)
              │                                    │
              ▼                                    ▼
       Phase 15 (Order) ◄─────────────────────────┘
              │
              ▼
       Phase 16 (Payment)
              │
              ▼
       Phase 17 (Checkout) ◄── Cart + Address + Order + Payment combined
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
  Phase 18  Phase 19  Phase 20–23 (Shipment, Email, Legal, Site, SEO, Testing)

Post-MVP (requires stable MVP):
  Phase 24 (Discount) ──► Phase 25 (Review) ──► Phase 26 (Refund)

Enterprise (requires stable Post-MVP):
  Phase 27 (Tax) ──► Phase 28 (Product Relationships) ──► Phase 29 (Loyalty)
  Phase 30 (Analytics) ──► Phase 31 (System Audit)
```

---

## MVP Phases (1–23)

---

### Phase 1: Foundation & Infrastructure

**Module:** Core (`src/core/`)  
**Status:** ✅ Complete  
**Dependencies:** None

| Status | Task |
|--------|------|
| ✅ | Next.js 16 with TypeScript, React 19, React Compiler |
| ✅ | Tailwind CSS v4 + PostCSS configuration |
| ✅ | ESLint + Prettier + Husky pre-commit hooks |
| ✅ | Path aliases (`@/`) via `tsconfig.json` |
| ✅ | Environment variable validation (`@t3-oss/env-nextjs`) |
| ✅ | Neon Postgres connection via `@neondatabase/serverless` |
| ✅ | Drizzle ORM with full schema (`db.schema.ts` — 18+ tables) |
| ✅ | Drizzle Kit scripts (generate, migrate, push, studio, drop, reset) |
| ✅ | 5 SQL migration files tracked |
| ✅ | Relational mapping for all entity relationships |
| ✅ | DB indexes on frequently queried columns |
| ✅ | tRPC v11 initialization with SuperJSON transformer |
| ✅ | Context factory with session/user injection |
| ✅ | `publicProcedure`, `protectedProcedure`, `adminProcedure`, `customerProcedure` |
| ✅ | Standardized `API_RESPONSE` wrapper + status/message constants |
| ✅ | Server-side caller factory for RSC data fetching |
| ✅ | React Query + tRPC client integration |
| ✅ | Resend email client integration |
| ✅ | React Email templates (welcome, verification, password reset, delete account) |
| ✅ | Shared schema layer (`pagination`, `api`, `common`, `enums`) |
| ✅ | Shared utilities (`slug.utils`, `soft-delete.utils`, `query.utils`) |
| 🟡 | Arcjet integration installed but not wired to middleware |

---

### Phase 2: Authentication & Authorization

**Module:** Auth (`src/core/auth/`, `src/module/auth/`)  
**Status:** ✅ Complete  
**Dependencies:** Phase 1

| Status | Task |
|--------|------|
| ✅ | Better Auth with email/password (verification required) |
| ✅ | GitHub OAuth social login |
| ✅ | Two-factor authentication (TOTP) |
| ✅ | Passkey / WebAuthn support |
| ✅ | Admin plugin with role-based access (`admin`, `user`) |
| ✅ | Session management with cookie caching |
| ✅ | Rate limiting (database-backed) |
| ✅ | Server-side session helpers (`getServerSession`) |
| ✅ | Client-side auth hooks (`auth.client.ts`) |
| ✅ | Permission definitions (`permissions.ts`) |
| ✅ | Sign In / Sign Up / Forgot Password / Reset Password forms |
| ✅ | Email Verification flow |
| ✅ | GitHub OAuth + Passkey buttons |
| ✅ | Sign-out (button, dropdown, icon variants) |
| 🟡 | `adminProcedure` and `customerProcedure` defined but never enforced on mutations |
| 🟡 | Permission check bug — `getServerUserPermission()` has inverted error logic |
| 🟡 | Blob upload has no auth guard |

---

### Phase 3: Shared UI & Design System

**Module:** Shared (`src/shared/`)  
**Status:** ✅ Complete  
**Dependencies:** Phase 1

| Status | Task |
|--------|------|
| ✅ | 56 Radix-based UI components (accordion, dialog, dropdown, tabs, tooltip, etc.) |
| ✅ | Custom components: `BlurImage`, `CardSwap`, `Empty`, `Spinner`, `KBD` |
| ✅ | Data table component (`@tanstack/react-table`) |
| ✅ | Generic `Form` component with schema validation (react-hook-form + Zod) |
| ✅ | 16 field types: text, password, email, number, select, multi-select, checkbox, radio, switch, textarea, color, currency, OTP, image upload, slug, array |
| ✅ | Shell component with section variants |
| ✅ | Header, Footer, Breadcrumbs, Sidebar, Nav-user components |
| ✅ | `cn()` Tailwind merge utility |
| ✅ | Logger, date/time, URL, data masking utilities |
| ✅ | `useMobile`, `useFileUpload` hooks |
| 🟡 | Image upload field has memory leak risk (requestAnimationFrame) |
| 🟡 | Currency field has type mismatch (string vs number) |

---

### Phase 4: Category Management

**Module:** Category (`src/module/category/`)  
**Status:** ✅ Complete  
**Dependencies:** Phase 1, Phase 3

| Status | Task |
|--------|------|
| ✅ | DB schema: `category` table with visibility, featured, display type, soft-delete |
| ✅ | tRPC API: full CRUD + `getMany`, `getAllFeatured`, `getManyWithSubcategories`, `getManyByTypes` |
| ✅ | Zod contract validation (`category.schema.ts`) |
| ✅ | Studio admin: list, create, edit, delete pages |
| ✅ | Store: category listing page (`/store/categories`) |
| ✅ | UI components: card, form, edit-form, delete dialog, listing, preview, section, skeleton, banner, shop-by |
| ✅ | Homepage: featured categories section + shop-by-category grid |
| 🟡 | Slug update logic bug on category update (checks same ID instead of other records) |
| 🟡 | No soft-delete filter on `get`/`getMany` queries |
| 🟡 | No cascading soft-delete to subcategories |

---

### Phase 5: Subcategory Management

**Module:** Subcategory (`src/module/subcategory/`)  
**Status:** ✅ Complete  
**Dependencies:** Phase 4 (Category)

| Status | Task |
|--------|------|
| ✅ | DB schema: `subcategory` table linked to `category` |
| ✅ | tRPC API: full CRUD + `getBySlug`, `getManyByCategorySlug` |
| ✅ | Studio admin: list, create, edit pages nested under category |
| ✅ | Store: subcategory listing under category (`/store/[categorySlug]`) |
| ✅ | UI components: form, edit-form, card, listing, skeleton |
| 🟡 | No soft-delete filter on queries |
| 🟡 | No duplicate slug check on create |
| 🟡 | No cascading soft-delete to series |

---

### Phase 6: Series Management

**Module:** Series (`src/module/series/`)  
**Status:** ✅ Complete  
**Dependencies:** Phase 5 (Subcategory)

| Status | Task |
|--------|------|
| ✅ | DB schema: `series` table linked to `subcategory` |
| ✅ | tRPC API: full CRUD + listing |
| ✅ | Studio admin: series page nested under subcategory |
| ✅ | Store: series page (`/store/[cat]/[subcat]/[seriesSlug]`) |
| ✅ | UI components: form, listing, card |
| 🟡 | `getMany` uses `protectedProcedure` (blocks unauthenticated storefront access) |

---

### Phase 7: Attribute Management

**Module:** Attribute (`src/module/attribute/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 6 (Series)

| Status | Task |
|--------|------|
| ✅ | DB schema: `attribute` table linked to `series` |
| ✅ | Zod contract validation (`attribute.schema.ts`) |
| ✅ | tRPC API: `getMany`, `create`, `update`, `delete`, `search` |
| ❌ | No Studio admin UI for standalone attribute management |
| ❌ | No attribute form component |
| ❌ | Missing DB index on `seriesSlug` |

---

### Phase 8: Product Management

**Module:** Product (`src/module/product/`)  
**Status:** ✅ Complete  
**Dependencies:** Phase 4 (Category), Phase 5 (Subcategory), Phase 6 (Series)

| Status | Task |
|--------|------|
| ✅ | DB schema: `product` table with category/subcategory/series references, status, pricing |
| ✅ | tRPC API: full CRUD + `getBySlug`, `getProductsBySeriesSlug`, `getPDPProductByVariant`, `search` |
| ✅ | Studio admin: list, create, edit product pages |
| ✅ | Store: PDP page (`/store/[cat]/[subcat]/[series]/[variant]`) |
| ✅ | UI components: form, card, listing, view, PDP layout, skeleton |
| 🟡 | Missing SEO fields (`metaTitle`, `metaDescription`) in form UI |
| 🟡 | Hardcoded `seriesSlug` default in create form |
| ❌ | No product filtering (by price, attributes) |
| ❌ | No product sorting (by price, date, popularity) |
| ❌ | No pagination on listing pages |

---

### Phase 9: Product Variant Management

**Module:** Product Variant (`src/module/product-variant/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 8 (Product)

| Status | Task |
|--------|------|
| ✅ | DB schema: `product_variant` with price modifiers, attributes (JSON), media (JSON) |
| ✅ | tRPC API: full CRUD + `getBySlug` (atomic creation with inventory via transaction) |
| ✅ | Studio admin: create variant page nested under product |
| ✅ | UI components: form, listing |
| 🟡 | `priceModifierValue` type mismatch — Zod schema uses `z.string()` but DB uses `numeric(10,2)` |
| 🟡 | Media array default value bug (`add()` uses `{ title: '' }` instead of `{ url: '' }`) |

---

### Phase 10: Inventory Management

**Module:** Inventory (`src/module/inventory/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 9 (Product Variant)

| Status | Task |
|--------|------|
| ✅ | DB schema: `inventory_item` + `inventory_reservation` tables |
| ✅ | tRPC API: full CRUD + `getByVariantId`, `getBySku`, `updateStock`, `search` |
| ✅ | Studio admin: inventory list, detail, edit pages |
| ✅ | UI components: card, form, listing |
| 🟡 | Uses **hard delete** instead of soft delete (inconsistent with other modules) |
| 🟡 | No non-negative validation on `quantity`, `incoming`, `reserved` |
| 🟡 | No business rule validation: `reserved <= quantity` |
| 🟡 | Null safety issue in edit form (spreads potentially null inventory data) |
| ❌ | Reservation logic not connected to cart/checkout flow |
| ❌ | No low-stock alerts and notifications |

---

### Phase 11: Account Management

**Module:** Account (`src/module/account/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 2 (Auth)

| Status | Task |
|--------|------|
| ✅ | Account root page with session guard |
| ✅ | User profile editing |
| ✅ | Password change form |
| ✅ | Set password (for OAuth users) |
| ✅ | Two-factor toggle |
| ✅ | Session management with revoke |
| ✅ | Account sidebar + layout components |
| ✅ | Commerce sidebar navigation |
| 🟡 | Profile form uses inline schema instead of shared `AuthSchema` |
| 🟡 | Profile form has no email format validation |
| 🟡 | Commerce sub-pages (order, payment, shipment, review) exist but are empty |

---

### Phase 12: Address Management

**Module:** Address (`src/module/address/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 11 (Account)

| Status | Task |
|--------|------|
| ✅ | DB schema: `address` table with user relation and type enum (billing/shipping) |
| ✅ | tRPC API: `getMany`, `create`, `update`, `delete`, `setDefault` with ownership checks |
| ✅ | API message constants defined |
| 🟡 | Account address page exists but content is empty |
| ❌ | No address form component |
| ❌ | No address card / listing component |

---

### Phase 13: Cart

**Module:** Cart (`src/module/cart/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 9 (Product Variant), Phase 10 (Inventory)

| Status | Task |
|--------|------|
| ✅ | DB schema: `cart` + `cart_line` tables with relations and indexes |
| ✅ | tRPC API: `get`, `getUserCart`, `add`, `update`, `remove`, `clear`, `getTotals`, `merge` |
| ✅ | Zod contract validation (`cart.schema.ts`) |
| ✅ | Guest cart via `sessionId` support |
| ✅ | Cart merge on login (guest → user) |
| ✅ | Inventory reservation on add-to-cart |
| ✅ | Add-to-cart UI flow wired on PDP |
| ✅ | Account cart page renders items with quantity controls and summary |
| ✅ | `useCart` hook for state management |
| ✅ | Cart button component with badge and tooltip |
| 🟡 | Cart button may still use hardcoded count in some places |
| ❌ | No cart drawer/widget in header |

---

### Phase 14: Wishlist

**Module:** Wishlist (`src/module/wishlist/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 9 (Product Variant)

| Status | Task |
|--------|------|
| ✅ | DB schema: `wishlist` table with user/variant relations |
| ✅ | tRPC API: `get`, `add`, `remove` with Zod contracts |
| ✅ | API message constants defined |
| ✅ | `useWishlist` hook exists |
| ✅ | Wishlist button component exists (`wishlist-button.tsx`) |
| 🟡 | Wishlist button component not fully wired to API |
| 🟡 | Account wishlist page exists but content is empty |
| ❌ | No wishlist item list with product details |
| ❌ | No "Move to Cart" functionality |

---

### Phase 15: Order Management

**Module:** Order (`src/module/order/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 13 (Cart), Phase 12 (Address)

| Status | Task |
|--------|------|
| ✅ | DB schema: `order` + `order_item` tables with full relations |
| ✅ | DB enums: `order_status` (pending/paid/shipped/delivered/cancelled) |
| ✅ | tRPC API: `get`, `getMany`, `create` (from cart, transactional), `updateStatus` |
| ✅ | Inventory deduction on order placement |
| ✅ | API message constants and routes defined |
| 🟡 | Account order page exists but content is empty |
| ❌ | No Studio order management pages (listing, detail, status updates) |
| ❌ | No order confirmation page |
| ❌ | No order status timeline UI |

---

### Phase 16: Payment Processing

**Module:** Payment (`src/module/payment/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 15 (Order)

| Status | Task |
|--------|------|
| ✅ | DB schema: `payment` table with order relation, provider enums, metadata |
| ✅ | DB enums: `payment_status`, `payment_provider` (stripe/razorpay/paypal/cod) |
| ✅ | tRPC API: `createIntent`, `confirm`, `getStatus` |
| ✅ | Routes defined (`PATH.STUDIO.PAYMENTS`) |
| 🟡 | Account payment page exists but content is empty |
| ❌ | No payment gateway integration (Stripe/Razorpay/PayPal SDK) |
| ❌ | No webhook handlers (`/api/webhooks/stripe` or `/api/webhooks/razorpay`) |
| ❌ | No payment form UI component |

---

### Phase 17: Checkout Flow

**Module:** Checkout (combined: Cart + Address + Order + Payment)  
**Status:** ❌ Not Started  
**Dependencies:** Phase 13 (Cart), Phase 12 (Address), Phase 15 (Order), Phase 16 (Payment)

| Status | Task |
|--------|------|
| 🟡 | Checkout page route exists (`/store/checkout`) — stub with incorrect metadata |
| ❌ | Checkout multi-step form (shipping → billing → payment → review) |
| ❌ | Address selection / new address form integration |
| ❌ | Order summary component (cart items + totals) |
| ❌ | Payment method selection and payment form |
| ❌ | Cart-to-order conversion UI trigger |
| ❌ | Order confirmation page with order details |
| ❌ | Guest checkout flow |
| ❌ | Coupon code input (deferred to Phase 24) |

---

### Phase 18: Shipment & Fulfillment

**Module:** Shipment (`src/module/shipment/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 15 (Order)

| Status | Task |
|--------|------|
| ✅ | DB schema: `shipment` table with `shipmentStatusEnum` and order relation |
| ✅ | tRPC API: `create`, `updateStatus`, `getByOrder` |
| ✅ | API message constants and routes defined |
| 🟡 | Account shipment page exists but content is empty |
| ❌ | No Studio fulfillment management UI |
| ❌ | No shipping rate calculation |
| ❌ | No carrier integration (Shippo/EasyPost) |
| ❌ | No customer-facing tracking page |

---

### Phase 19: Email & Notifications

**Module:** Email (`src/core/mail/`)  
**Status:** 🟡 Partial  
**Dependencies:** Phase 15 (Order), Phase 16 (Payment)

| Status | Task |
|--------|------|
| ✅ | Resend client integration |
| ✅ | Templates: welcome, verification, password reset, delete account |
| ✅ | Order confirmation template designed |
| ✅ | Professional ShopHub branding |
| ❌ | Order confirmation email not wired to order/payment events |
| ❌ | Payment confirmation email |
| ❌ | Shipment notification email |
| ❌ | Low stock alert email (admin) |
| ❌ | Order status change notification |

---

### Phase 20: Legal & Cookies

**Module:** Legal (`src/module/legal/`) + Cookies (`src/module/cookies/`)  
**Status:** ✅ Complete  
**Dependencies:** Phase 1

| Status | Task |
|--------|------|
| ✅ | Legal pages with dynamic `[slug]` routing |
| ✅ | Legal sidebar + table of contents components |
| ✅ | Policy content rendering component |
| ✅ | Cookie consent banner component |
| ✅ | Cookie utility functions |
| ✅ | `useCookieConsent` hook |
| 🟡 | Legal content is placeholder ("Last updated: October 2025") |

---

### Phase 21: Site & Marketing Pages

**Module:** Site (`src/module/site/`) + Support pages  
**Status:** 🟡 Partial  
**Dependencies:** Phase 8 (Product)

| Status | Task |
|--------|------|
| ✅ | Homepage with hero, featured categories, shop-by grid, FAQ |
| ✅ | Category → Subcategory → Series → Variant breadcrumb navigation |
| ✅ | Product listing by series with variant cards |
| ✅ | Loading skeletons for all catalog pages |
| 🟡 | About page — likely placeholder |
| 🟡 | Newsletter page — likely placeholder |
| 🟡 | Support pages (FAQ, help center, returns, shipping, contact) — routes exist, likely placeholder |
| 🟡 | Ticket system routes exist but no backend/API |
| ❌ | No product search bar in header (API exists) |
| ❌ | Blog (routes defined but no implementation) |

---

### Phase 22: SEO & Production Readiness

**Module:** Cross-cutting  
**Status:** 🟡 Partial  
**Dependencies:** Phase 17 (Checkout), Phase 21 (Site)

| Status | Task |
|--------|------|
| ✅ | React Compiler enabled |
| ✅ | View Transitions API enabled |
| ✅ | Image optimization via `next/image` |
| ✅ | Web Vitals tracking utility |
| ✅ | Global error, not-found, forbidden, loading pages |
| ✅ | Vercel-ready config with Blob storage and Neon DB |
| 🟡 | Basic page metadata on most pages |
| 🟡 | Site config uses placeholder values ("Logo", "example.com") |
| ❌ | No `sitemap.xml` generation |
| ❌ | No `robots.txt` |
| ❌ | No Open Graph / social media meta tags |
| ❌ | No JSON-LD structured data for products |
| ❌ | No CI/CD pipeline configuration |
| ❌ | No staging environment setup |
| ❌ | Replace all placeholder branding site-wide |

---

### Phase 23: Testing Infrastructure

**Module:** Cross-cutting  
**Status:** ❌ Not Started  
**Dependencies:** Phase 17 (Checkout)

| Status | Task |
|--------|------|
| ❌ | Configure Vitest for unit testing |
| ❌ | Unit tests for all tRPC API routers |
| ❌ | Schema validation tests for Zod contracts |
| ❌ | Configure Playwright for E2E testing |
| ❌ | E2E tests for auth flow (sign-in, sign-up, password reset) |
| ❌ | E2E tests for checkout flow (browse → cart → checkout → confirm) |
| ❌ | E2E tests for admin CRUD operations |
| ❌ | API contract / integration tests |

---

## Post-MVP Phases (24–26)

> These features extend the core commerce engine after a stable MVP launch.

---

### Phase 24: Discount & Coupon System

**Module:** Discount (`src/module/discount/`)  
**Status:** 🟡 Schema Only  
**Dependencies:** Phase 15 (Order), Phase 8 (Product)

| Status | Task |
|--------|------|
| ✅ | DB schema: `discount` + `order_discount` tables with `discountTypeEnum` |
| ✅ | API message constants defined |
| ✅ | Routes defined (`PATH.STUDIO.DISCOUNTS`) |
| ❌ | tRPC discount router (CRUD + validation) |
| ❌ | Coupon code validation logic |
| ❌ | Discount management Studio UI |
| ❌ | Coupon code input in checkout |
| ❌ | Usage tracking and limits |

---

### Phase 25: Product Reviews & Ratings

**Module:** Review (`src/module/review/`)  
**Status:** 🟡 Schema Only  
**Dependencies:** Phase 8 (Product), Phase 15 (Order)

| Status | Task |
|--------|------|
| ✅ | DB schema: `review` table |
| ✅ | API message constants defined |
| 🟡 | Account review page exists but content is empty |
| ❌ | tRPC review router (CRUD + moderation) |
| ❌ | Review form component (rating, comment) |
| ❌ | Review display on PDP |
| ❌ | Review moderation system for admin |

---

### Phase 26: Refund Management

**Module:** Refund (`src/module/refund/`)  
**Status:** ❌ Not Started  
**Dependencies:** Phase 16 (Payment), Phase 15 (Order)

| Status | Task |
|--------|------|
| ❌ | DB enums: `refund_status`, `refund_reason` |
| ❌ | DB tables: `refund`, `refund_item`, `refund_status_history` |
| ❌ | tRPC refund router |
| ❌ | Refund workflow UI (admin) |
| ❌ | Customer refund request flow |
| ❌ | Payment gateway refund integration |

---

## Enterprise Phases (27–31)

> These transform the platform into an enterprise-ready commerce system with auditability, analytics, and retention. Requires stable Post-MVP.

---

### Phase 27: Tax Configuration

**Module:** Tax (`src/module/tax/`)  
**Status:** ❌ Not Started  
**Dependencies:** Phase 8 (Product), Phase 15 (Order)

| Status | Task |
|--------|------|
| ❌ | DB tables: `tax_category`, `tax_rate`, `tax_rule`, `tax_exemption` |
| ❌ | Tax calculation engine |
| ❌ | TaxJar/Avalara integration |
| ❌ | Tax configuration Studio UI |
| ❌ | Tax display at checkout |

---

### Phase 28: Product Relationships (Cross-sell, Upsell, Bundles)

**Module:** Product Intelligence  
**Status:** ❌ Not Started  
**Dependencies:** Phase 8 (Product)

| Status | Task |
|--------|------|
| ❌ | DB tables: `product_relationship`, `bundle_component`, `relationship_rule` |
| ❌ | DB enum: `relationship_type` (cross_sell, upsell, bundle, accessory) |
| ❌ | tRPC product relationship router |
| ❌ | PDP cross-sell/upsell display |
| ❌ | Bundle pricing logic |
| ❌ | Product relationship management UI (admin) |

---

### Phase 29: Loyalty & Rewards

**Module:** Loyalty (`src/module/loyalty/`)  
**Status:** ❌ Not Started  
**Dependencies:** Phase 15 (Order), Phase 11 (Account)

| Status | Task |
|--------|------|
| ❌ | DB tables: `loyalty_program`, `loyalty_tier`, `customer_loyalty`, `loyalty_transaction`, `reward` |
| ❌ | Points calculation engine |
| ❌ | Tier management system |
| ❌ | Loyalty program admin UI |
| ❌ | Customer rewards dashboard |
| ❌ | Points redemption at checkout |

---

### Phase 30: Analytics & Intelligence

**Module:** Product Analytics (`src/module/product-analytics/`)  
**Status:** ❌ Not Started  
**Dependencies:** Phase 13 (Cart), Phase 8 (Product)

| Status | Task |
|--------|------|
| ❌ | DB tables: `cart_abandonment`, `abandonment_recovery` |
| ❌ | DB tables: `product_view`, `product_analytics_summary`, `product_conversion_funnel` |
| ❌ | Cart abandonment detection logic |
| ❌ | Recovery email sequences |
| ❌ | Product view event collection middleware |
| ❌ | Analytics aggregation pipeline |
| ❌ | Admin analytics dashboard (sales, customers, products) |
| ❌ | Trending / popular products API |

---

### Phase 31: System-Wide Audit Logging

**Module:** Audit  
**Status:** ❌ Not Started  
**Dependencies:** All modules

| Status | Task |
|--------|------|
| ❌ | DB tables: `audit_log`, `audit_log_archive` |
| ❌ | DB tables: `order_status_history`, `order_audit_log` |
| ❌ | DB enum: `audit_action_type` |
| ❌ | Audit middleware for all mutations |
| ❌ | Admin audit log viewer |
| ❌ | Data retention policies (GDPR compliance) |

---

## Security & Data Integrity Fixes (Cross-Phase)

> These tasks should be addressed alongside the phase they impact. Listed here for visibility.

| Priority | Task | Affects Phase |
|----------|------|---------------|
| 🔴 CRITICAL | Switch catalog mutations from `protectedProcedure` to `adminProcedure` | 2, 4–10 |
| 🔴 CRITICAL | Fix `getServerUserPermission()` inverted error logic | 2 |
| 🔴 CRITICAL | Add auth guard + rate limiting to `/api/blob/upload` | 2 |
| 🔴 CRITICAL | Fix `priceModifierValue` type mismatch (string → number) | 9 |
| 🟡 HIGH | Fix category update slug check bug (`ne` instead of `eq`) | 4 |
| 🟡 HIGH | Add soft-delete filters to category/subcategory queries | 4, 5 |
| 🟡 HIGH | Change inventory delete from hard to soft delete | 10 |
| 🟡 HIGH | Add cascading soft-delete (category → subcategory → series → product) | 4, 5, 6, 8 |
| 🟡 HIGH | Add missing DB indexes (`inventory_item.variantId`, `cart.userId`, etc.) | 10, 13, 14 |
| 🟡 HIGH | Fix `Boolean(process.env.SKIP_ENV_VALIDATION)` coercion bug | 1 |
| 🟡 HIGH | Activate Arcjet middleware on `/api/v1` route | 1, 2 |
| 🟡 MEDIUM | Create `.env.example` and remove real secrets from `.env` | 1 |
| 🟡 MEDIUM | Fix `ARKJET_API_KEY` typo to `ARCJET_API_KEY` | 1 |
| 🟡 MEDIUM | Add non-negative validation to inventory schema fields | 10 |

---

## Estimated Timeline

| Scope | Phases | Duration | Status |
|-------|--------|----------|--------|
| **Foundation** | 1–3 | 2 weeks | ✅ Done |
| **Product Catalog** | 4–10 | 3 weeks | ✅ Mostly Done |
| **Account & Commerce APIs** | 11–16 | 2–3 weeks | 🟡 APIs Done, UIs Pending |
| **Checkout & Fulfillment** | 17–19 | 2–3 weeks | ❌ Not Started |
| **Polish & Launch** | 20–23 | 2 weeks | 🟡 Partial |
| **Post-MVP** | 24–26 | 4–6 weeks | ❌ Not Started |
| **Enterprise** | 27–31 | 12–16 weeks | ❌ Not Started |

**MVP Target: 8–10 weeks total** (foundation already done, ~4–6 weeks remaining)

---

## Progress Table

| Phase | Module | Dependencies | Status | Completion |
|:-----:|--------|:------------:|:------:|:----------:|
| 1 | Foundation & Infrastructure | — | ✅ Complete | 95% |
| 2 | Authentication & Authorization | Phase 1 | ✅ Complete | 90% |
| 3 | Shared UI & Design System | Phase 1 | ✅ Complete | 93% |
| 4 | Category Management | Phase 1, 3 | ✅ Complete | 90% |
| 5 | Subcategory Management | Phase 4 | ✅ Complete | 85% |
| 6 | Series Management | Phase 5 | ✅ Complete | 90% |
| 7 | Attribute Management | Phase 6 | 🟡 Partial | 50% |
| 8 | Product Management | Phase 4, 5, 6 | ✅ Complete | 85% |
| 9 | Product Variant | Phase 8 | 🟡 Partial | 80% |
| 10 | Inventory Management | Phase 9 | 🟡 Partial | 70% |
| 11 | Account Management | Phase 2 | 🟡 Partial | 75% |
| 12 | Address Management | Phase 11 | 🟡 Partial | 40% |
| 13 | Cart | Phase 9, 10 | 🟡 Partial | 80% |
| 14 | Wishlist | Phase 9 | 🟡 Partial | 45% |
| 15 | Order Management | Phase 13, 12 | 🟡 Partial | 50% |
| 16 | Payment Processing | Phase 15 | 🟡 Partial | 35% |
| 17 | Checkout Flow | Phase 13, 12, 15, 16 | ❌ Not Started | 5% |
| 18 | Shipment & Fulfillment | Phase 15 | 🟡 Partial | 35% |
| 19 | Email & Notifications | Phase 15, 16 | 🟡 Partial | 50% |
| 20 | Legal & Cookies | Phase 1 | ✅ Complete | 90% |
| 21 | Site & Marketing Pages | Phase 8 | 🟡 Partial | 55% |
| 22 | SEO & Production Readiness | Phase 17, 21 | 🟡 Partial | 30% |
| 23 | Testing Infrastructure | Phase 17 | ❌ Not Started | 0% |
| **MVP Subtotal** | | | | **~63%** |
| 24 | Discount & Coupon System | Phase 15, 8 | 🟡 Schema Only | 20% |
| 25 | Product Reviews & Ratings | Phase 8, 15 | 🟡 Schema Only | 15% |
| 26 | Refund Management | Phase 16, 15 | ❌ Not Started | 0% |
| **Post-MVP Subtotal** | | | | **~12%** |
| 27 | Tax Configuration | Phase 8, 15 | ❌ Not Started | 0% |
| 28 | Product Relationships | Phase 8 | ❌ Not Started | 0% |
| 29 | Loyalty & Rewards | Phase 15, 11 | ❌ Not Started | 0% |
| 30 | Analytics & Intelligence | Phase 13, 8 | ❌ Not Started | 0% |
| 31 | System-Wide Audit Logging | All | ❌ Not Started | 0% |
| **Enterprise Subtotal** | | | | **0%** |

---

## Module Dependency Matrix

> Quick reference showing which modules must be complete before others can start.

| Module | Requires |
|--------|----------|
| Category | Foundation |
| Subcategory | Category |
| Series | Subcategory |
| Attribute | Series |
| Product | Category, Subcategory, Series |
| Product Variant | Product |
| Inventory | Product Variant |
| Account | Auth |
| Address | Account |
| Cart | Product Variant, Inventory |
| Wishlist | Product Variant |
| Order | Cart, Address |
| Payment | Order |
| Checkout | Cart, Address, Order, Payment |
| Shipment | Order |
| Email | Order, Payment |
| Discount | Order, Product |
| Review | Product, Order |
| Refund | Payment, Order |
| Tax | Product, Order |
| Product Relationships | Product |
| Loyalty | Order, Account |
| Analytics | Cart, Product |
| System Audit | All modules |

---

*Generated: 2026-03-05 — Consolidated from markdown/00-index.md through markdown/07-completion-roadmap.md, cart.md, and api-migration-guide.md*
