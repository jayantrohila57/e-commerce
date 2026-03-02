# E-Commerce Project — Development Plan

> **Generated:** 2026-03-02 · **Stack:** Next.js 16 · tRPC · Drizzle ORM · Neon Postgres · Better Auth · Radix UI · Tailwind CSS v4  
> **Repository:** `d:\Repositories\template\e-commerce`

---

## 📚 Document Navigation

| ← Previous | Index | Next → |
|------------|-------|--------|
| — | [00-index.md](./00-index.md) | [02-architecture-review.md](./02-architecture-review.md) |

**Related Documents:**
- Detailed API analysis → [03-api-analysis.md](./03-api-analysis.md)
- Consolidated findings → [06-full-system-audit.md](./06-full-system-audit.md)
- Action plan → [07-completion-roadmap.md](./07-completion-roadmap.md)

---

## Legend

| Icon | Meaning |
|------|---------|
| ✅ | **Completed** — Fully implemented and functional |
| 🟡 | **Partial** — Scaffolded or partially working; needs more work |
| ❌ | **Not Implemented** — Route/message definitions may exist, but no logic |

---

## Phase 1 — Foundation & Infrastructure

### 1.1 Project Scaffolding
| Status | Task |
|--------|------|
| ✅ | Next.js 16 app with TypeScript, React 19, React Compiler |
| ✅ | Tailwind CSS v4 + PostCSS configuration |
| ✅ | ESLint + Prettier + Husky pre-commit hooks |
| ✅ | Path aliases (`@/`) via `tsconfig.json` |
| ✅ | Environment variable validation (`@t3-oss/env-nextjs`, `env.client.ts`, `env.server.ts`) |
| ✅ | `.env` with all required secrets (DB, Auth, Mail, Blob, Arcjet) |

### 1.2 Database Layer
| Status | Task |
|--------|------|
| ✅ | Neon Postgres connection via `@neondatabase/serverless` |
| ✅ | Drizzle ORM setup with full schema (`db.schema.ts` — 18 tables) |
| ✅ | Drizzle Kit scripts (generate, migrate, push, studio, drop, reset) |
| ✅ | 5 SQL migration files tracked |
| ✅ | Relational mapping for all entity relationships |
| ✅ | DB indexes on frequently queried columns (visibility, featured, slugs, status) |

### 1.3 Authentication & Authorization
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
| ✅ | Permission definitions (`permissions.ts` — AC rules for admin/user) |

### 1.4 API Layer (tRPC)
| Status | Task |
|--------|------|
| ✅ | tRPC v11 initialization with SuperJSON transformer |
| ✅ | Context factory with session/user injection |
| ✅ | `publicProcedure`, `protectedProcedure`, `adminProcedure`, `customerProcedure` |
| ✅ | Standardized `API_RESPONSE` wrapper + status/message constants |
| ✅ | Zod error formatting in tRPC error handler |
| ✅ | Server-side caller factory for RSC data fetching |
| ✅ | React Query + tRPC client integration |
| ✅ | `HydrateClient` for SSR → client hydration |

### 1.5 Email System
| Status | Task |
|--------|------|
| ✅ | Resend client integration (`resend.client.ts`) |
| ✅ | React Email templates: welcome, verification, password reset, delete account |
| ✅ | `mail.methods.tsx` with send functions for all email types |
| 🟡 | Email templates use placeholder branding ("Logo", "example.com") |

### 1.6 Security
| Status | Task |
|--------|------|
| 🟡 | Arcjet integration (`@arcjet/next`) — dependencies installed, env vars set, but no middleware/route protection found |
| ✅ | Auth rate limiting via database |

---

## Phase 2 — Product Catalog & Admin Studio

### 2.1 Category Management
| Status | Task |
|--------|------|
| ✅ | DB schema: `category` table with visibility, featured, display type, soft-delete |
| ✅ | tRPC API: full CRUD + `getMany`, `getAllFeatured`, `getManyWithSubcategories`, `getManyByTypes`, `getCategoryWithSubCategories` |
| ✅ | Zod contract validation (`category.schema.ts`) |
| ✅ | Studio admin: list, create, edit, delete pages |
| ✅ | Store: category listing page (`/store/categories`) |
| ✅ | UI components: card, form, edit-form, delete dialog, listing, preview, section, skeleton, banner, shop-by |
| ✅ | Homepage: featured categories section + shop-by-category grid |

### 2.2 Subcategory Management
| Status | Task |
|--------|------|
| ✅ | DB schema: `subcategory` table linked to `category` |
| ✅ | tRPC API: full CRUD + `getBySlug`, `getManyByCategorySlug` |
| ✅ | Studio admin: list, create, edit pages nested under category |
| ✅ | Store: subcategory listing under category (`/store/[categorySlug]`) |
| ✅ | UI components: form, edit-form, card, listing, skeleton |

### 2.3 Series Management
| Status | Task |
|--------|------|
| ✅ | DB schema: `series` table linked to `subcategory` |
| ✅ | tRPC API: full CRUD + listing |
| ✅ | Studio admin: series page nested under subcategory |
| ✅ | Store: series page (`/store/[cat]/[subcat]/[seriesSlug]`) |
| ✅ | UI components: form, listing, card |

### 2.4 Product Management
| Status | Task |
|--------|------|
| ✅ | DB schema: `product` table with category/subcategory/series references, status, pricing |
| ✅ | tRPC API: full CRUD + `getBySlug`, `getProductsBySeriesSlug`, `getPDPProductByVariant`, `getProductWithProductVariants`, `search` |
| ✅ | Studio admin: list, create, edit product pages |
| ✅ | Store: PDP page (`/store/[cat]/[subcat]/[series]/[variant]`) |
| ✅ | UI components: form, card, listing, view, PDP layout, skeleton |

### 2.5 Product Variants
| Status | Task |
|--------|------|
| ✅ | DB schema: `product_variant` with price modifiers, attributes, media (JSON) |
| ✅ | tRPC API: full CRUD + `getBySlug` (atomic creation with inventory) |
| ✅ | Studio admin: create variant page nested under product |
| ✅ | UI components: form, listing |

### 2.6 Inventory Management
| Status | Task |
|--------|------|
| ✅ | DB schema: `inventory_item` + `inventory_reservation` tables |
| ✅ | tRPC API: full CRUD + `getByVariantId`, `getBySku`, `updateStock`, `search` |
| ✅ | Studio admin: inventory list, detail, edit pages |
| ✅ | UI components: card, form, listing |
| ❌ | Reservation logic (schema exists, no API/business logic) |
| ❌ | Low-stock alerts and notifications |

### 2.7 Attributes
| Status | Task |
|--------|------|
| 🟡 | DB schema + types exist (`attribute.schema.ts`, `attribute.types.ts`) |
| ❌ | No tRPC API router for standalone attribute management |
| ❌ | No Studio admin UI for attributes (managed inline via series/variants) |

### 2.8 Media Management
| Status | Task |
|--------|------|
| 🟡 | DB schema: `media` table exists |
| ✅ | Vercel Blob integration (`@vercel/blob`) for uploads |
| ✅ | Image upload field component (`field.image-upload.tsx`) |
| ❌ | No media library / management API or UI |

### 2.9 Studio Dashboard
| Status | Task |
|--------|------|
| 🟡 | Dashboard page exists but shows placeholder "Hello" text |
| ❌ | No analytics widgets, recent orders, revenue charts, or activity feed |
| ✅ | Sidebar navigation component for studio |

---

## Phase 3 — Commerce Engine

### 3.1 Shopping Cart
| Status | Task |
|--------|------|
| ✅ | DB schema: `cart` + `cart_line` tables with relations |
| ✅ | API message constants defined (CREATE, GET, ADD_ITEM, UPDATE_ITEM, REMOVE_ITEM, CLEAR_CART) |
| ❌ | No tRPC cart router |
| ❌ | No add-to-cart UI flow |
| 🟡 | Account cart page exists but content area is empty |
| 🟡 | Cart button component exists in shared (`cart-button.tsx`) |

### 3.2 Wishlist
| Status | Task |
|--------|------|
| ✅ | DB schema: `wishlist` table with user/variant relations |
| ✅ | API message constants defined |
| ❌ | No tRPC wishlist router |
| ❌ | No wishlist logic |
| 🟡 | Account wishlist page exists but content is empty |
| 🟡 | Wishlist button component exists in shared (`wishlist-button.tsx`) |

### 3.3 Checkout Flow
| Status | Task |
|--------|------|
| 🟡 | Checkout page route exists (`/store/checkout`) — stub with incorrect metadata ("Contact Support") |
| ❌ | No checkout form, address selection, payment method selection |
| ❌ | No order summary or cart-to-checkout transition |

### 3.4 Order Management
| Status | Task |
|--------|------|
| ✅ | DB enums: `order_status` (pending/paid/shipped/delivered/cancelled) |
| ✅ | API message constants defined (CREATE, GET, GET_USER_ORDERS, CANCEL_ORDER) |
| ✅ | Routes defined (`PATH.STUDIO.ORDERS`) |
| ❌ | No `order` DB table (enum exists, table missing) |
| ❌ | No tRPC order router |
| ❌ | No Studio order management pages |
| 🟡 | Account order page exists but content is empty |

### 3.5 Payment Processing
| Status | Task |
|--------|------|
| ✅ | DB enums: `payment_status`, `payment_provider` (stripe/razorpay/paypal/cod) |
| ✅ | Routes defined (`PATH.STUDIO.PAYMENTS`) |
| ❌ | No payment DB table |
| ❌ | No payment gateway integration (Stripe/Razorpay/PayPal) |
| ❌ | No tRPC payment router |
| 🟡 | Account payment page exists but content is empty |

### 3.6 Shipping & Fulfillment
| Status | Task |
|--------|------|
| ✅ | DB enum: `shipment_status` (pending/in_transit/delivered) |
| ✅ | API message constants defined (CREATE, UPDATE_TRACKING) |
| ✅ | Routes defined (`PATH.STUDIO.SHIPPING`) |
| ❌ | No shipment DB table |
| ❌ | No tRPC shipment router |
| ❌ | No shipping rate calculation or carrier integration |
| 🟡 | Account shipment page exists but content is empty |

### 3.7 Address Management
| Status | Task |
|--------|------|
| ✅ | API message constants defined (CRUD + GET_USER_ADDRESSES) |
| ❌ | No `address` DB table |
| ❌ | No tRPC address router |
| 🟡 | Account address page exists but content is empty |

### 3.8 Discounts & Coupons
| Status | Task |
|--------|------|
| ✅ | DB enum: `discount_type` (flat/percent) |
| ✅ | API message constants defined (CRUD + VALIDATE_CODE) |
| ✅ | Routes defined (`PATH.STUDIO.DISCOUNTS`) |
| ❌ | No discount DB table |
| ❌ | No tRPC discount router |
| ❌ | No coupon code UI in checkout |

### 3.9 Product Reviews
| Status | Task |
|--------|------|
| ✅ | API message constants defined (CRUD + GET_PRODUCT_REVIEWS, GET_USER_REVIEWS) |
| ❌ | No `review` DB table |
| ❌ | No tRPC review router |
| ❌ | No review UI on PDP or account page |
| 🟡 | Account review page exists but content is empty |

---

## Phase 4 — Customer Experience

### 4.1 Auth UI Flows
| Status | Task |
|--------|------|
| ✅ | Sign In form with email/password + remember me |
| ✅ | Sign Up form with validation |
| ✅ | Forgot Password flow |
| ✅ | Reset Password flow |
| ✅ | Email Verification flow |
| ✅ | GitHub OAuth sign-in button |
| ✅ | Passkey registration button |
| ✅ | Auth page loading state |
| ✅ | Sign-out (button, dropdown, icon variants) |
| 🟡 | Auth card layout has a TODO for `support@yourapp.com` mailto link |

### 4.2 Account Management
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

### 4.3 Storefront UX
| Status | Task |
|--------|------|
| ✅ | Homepage with hero, featured categories, shop-by grid |
| ✅ | Category → Subcategory → Series → Variant breadcrumb navigation |
| ✅ | Product listing by series with variant cards |
| ✅ | Product detail page (PDP) with variant display |
| ✅ | Loading skeletons for all catalog pages |
| 🟡 | Product search (API exists, no search bar UI in header) |
| ❌ | Product filtering (by price, attributes, etc.) |
| ❌ | Product sorting (by price, date, popularity) |
| ❌ | Pagination on listing pages |
| ❌ | Recently viewed products |

### 4.4 Site / Marketing Pages
| Status | Task |
|--------|------|
| 🟡 | About page route exists — likely placeholder |
| 🟡 | Newsletter page route exists — likely placeholder |
| ❌ | Blog (routes defined in `PATH.BLOG` — no implementation) |

### 4.5 Support & Help
| Status | Task |
|--------|------|
| 🟡 | Support root, contact, FAQ, help center, returns, shipping pages exist as routes |
| 🟡 | Ticket system routes exist (`/support/tickets`, `/support/tickets/[id]`) |
| ❌ | No ticket backend / API |
| ❌ | No live chat or contact form integration |

### 4.6 Legal Pages
| Status | Task |
|--------|------|
| ✅ | Legal pages with dynamic `[slug]` routing |
| ✅ | Legal sidebar + table of contents components |
| ✅ | Policy content rendering component |
| 🟡 | Content is likely placeholder ("Last updated: October 2025") |

### 4.7 Cookie Consent
| Status | Task |
|--------|------|
| ✅ | Cookie consent banner component |
| ✅ | Cookie utility functions (`cookies.ts`) |
| ✅ | `useCookieConsent` hook |

---

## Phase 5 — Shared UI & Design System

### 5.1 UI Component Library
| Status | Task |
|--------|------|
| ✅ | 56 Radix-based UI components (accordion, dialog, dropdown, tabs, tooltip, etc.) |
| ✅ | Custom components: `BlurImage`, `CardSwap`, `Empty`, `Spinner`, `KBD` |
| ✅ | Data table component (likely via `@tanstack/react-table`) |

### 5.2 Form System
| Status | Task |
|--------|------|
| ✅ | Generic `Form` component with schema validation (`react-hook-form` + `zod`) |
| ✅ | 16 field types: text, password, email, number, select, multi-select, checkbox, radio, switch, textarea, color, currency, OTP, image upload, slug, array |
| ✅ | Field config system (`fields.config.tsx`) |
| ✅ | Form helpers and type definitions |

### 5.3 Layout System
| Status | Task |
|--------|------|
| ✅ | Shell component with section variants (default, dashboard) |
| ✅ | Header with logo + actions |
| ✅ | Footer component |
| ✅ | Breadcrumbs component |
| ✅ | Sidebar with navigation, logo, header, get-started card |
| ✅ | Section component with title/description/action |
| ✅ | Dashboard section layout |
| ✅ | Nav-user component |

### 5.4 Common Components
| Status | Task |
|--------|------|
| ✅ | Promo banner, sale alert, scroll progress, scroll-to-top |
| ✅ | Social links component |
| ✅ | RSS feed component |
| ✅ | Go-back navigation |
| ✅ | Code preview component |
| 🟡 | Push notification prompt component (likely placeholder) |
| 🟡 | Icons component |

### 5.5 Utilities
| Status | Task |
|--------|------|
| ✅ | `cn()` Tailwind merge utility |
| ✅ | Logger utilities (debug log, debug error) |
| ✅ | Date/time utilities |
| ✅ | URL utilities |
| ✅ | Data masking utility |
| ✅ | Font loading method |
| ✅ | Web Vitals tracking |
| ✅ | `useMobile` hook |
| ✅ | `useFileUpload` hook |

---

## Phase 6 — Marketing & Analytics

### 6.1 Marketing Tools
| Status | Task |
|--------|------|
| ✅ | Routes defined (`PATH.STUDIO.MARKETING`, campaigns) |
| ❌ | No marketing campaign management |
| ❌ | No email campaign / newsletter integration |
| ❌ | No promo code engine |

### 6.2 Analytics Dashboard
| Status | Task |
|--------|------|
| ✅ | Routes defined (`PATH.STUDIO.ANALYTICS`, sales, customers) |
| ✅ | Recharts dependency installed |
| ❌ | No analytics data collection or APIs |
| ❌ | No sales/revenue/customer dashboards |

### 6.3 Customer Management (Admin)
| Status | Task |
|--------|------|
| ✅ | Routes defined (`PATH.STUDIO.CUSTOMERS`) |
| ❌ | No customer list/detail admin pages |
| ❌ | No customer segmentation or CRM features |

---

## Phase 7 — Testing, Optimization & Deployment

### 7.1 Testing
| Status | Task |
|--------|------|
| ❌ | No unit test framework configured |
| ❌ | No integration tests |
| ❌ | No E2E testing (Playwright/Cypress) |
| ❌ | No API contract tests |

### 7.2 Performance & SEO
| Status | Task |
|--------|------|
| ✅ | React Compiler enabled |
| ✅ | View Transitions API enabled |
| ✅ | Image optimization via `next/image` with remote patterns |
| ✅ | Web Vitals tracking utility |
| 🟡 | Basic page metadata (title/description) on most pages |
| ❌ | No structured data (JSON-LD) for products |
| ❌ | No `sitemap.xml` generation (route defined, no implementation) |
| ❌ | No `robots.txt` |
| ❌ | No Open Graph / social media meta tags |

### 7.3 Error Handling & Observability
| Status | Task |
|--------|------|
| ✅ | Global error page (`error.tsx`) |
| ✅ | Not found page (`not-found.tsx`) |
| ✅ | Forbidden page (`forbidden.tsx`) |
| ✅ | Global loading state (`loading.tsx`) |
| ✅ | Debug logger utilities |
| ❌ | No error tracking service (Sentry, etc.) |
| ❌ | No application monitoring |

### 7.4 Deployment
| Status | Task |
|--------|------|
| ✅ | Vercel-ready config (`VERCEL=1` env flag) |
| ✅ | Vercel Blob storage configured |
| ✅ | Neon database (cloud Postgres) |
| 🟡 | Site config uses placeholder values ("Logo", "example.com") |
| ❌ | No CI/CD pipeline configuration |
| ❌ | No staging environment setup |
| ❌ | No production deployment documentation |

---

## Project Completion Summary

### Overall Progress

| Phase | Completed | Partial | Not Done | Completion |
|-------|-----------|---------|----------|------------|
| 1 — Foundation | 27 | 2 | 0 | **~93%** |
| 2 — Catalog & Admin | 32 | 3 | 5 | **~80%** |
| 3 — Commerce Engine | 15 | 9 | 18 | **~36%** |
| 4 — Customer Experience | 21 | 8 | 8 | **~57%** |
| 5 — UI & Design System | 27 | 2 | 0 | **~93%** |
| 6 — Marketing & Analytics | 3 | 0 | 5 | **~20%** |
| 7 — Testing & Deployment | 10 | 2 | 9 | **~43%** |

### **Overall Project Completion: ~55%**

### What Works Today
- Full auth system (email, OAuth, 2FA, passkeys, sessions)
- Complete product catalog CRUD (categories → subcategories → series → products → variants)
- Inventory management with stock operations
- Studio admin for product/category/inventory management
- Storefront browsing (homepage → catalog → PDP)
- Email system (welcome, verification, password reset, account deletion)
- 56-component UI library with comprehensive form system

### Critical Path to Production

> [!CAUTION]
> The following items represent the **minimum viable path** to launch a functional e-commerce store:

1. **Cart API + UI** — Build tRPC cart router, implement add-to-cart on PDP, cart page in account
2. **Order & OrderItem DB tables** — Create schema, migration, tRPC router
3. **Checkout flow** — Address form, order summary, order placement
4. **Payment integration** — Stripe or Razorpay with payment DB table
5. **Order confirmation email** — Add to mail system
6. **Admin order management** — Studio pages for viewing/updating order status
7. **Site branding** — Replace all "Logo" / "example.com" placeholders
8. **SEO essentials** — Sitemap, robots.txt, OG tags, product structured data
9. **Arcjet middleware** — Activate rate limiting & bot protection on routes
10. **Basic E2E testing** — Critical flows (auth, browse, purchase)

### Technical Debt & Issues

> [!WARNING]
> - **Duplicate relation definitions:** `productVariantRelations` is defined twice in `db.schema.ts` (line 356 and 433)
> - **Checkout page metadata bug:** Shows "Contact Support" instead of checkout-related text
> - **Missing DB tables:** Orders, payments, shipments, addresses, discounts, reviews have enums/routes/messages but no actual schema tables
> - **Arcjet unused:** Security dependency installed but not integrated into any middleware
> - **Placeholder branding:** Site name is "Logo", address/email/social links are all generic
> - **2 TODO comments:** Route fixes needed in `auth.card-layout.tsx` and `reset-password/page.tsx`
> - **`.env` contains real secrets** — Should use `.env.example` pattern for the repository
