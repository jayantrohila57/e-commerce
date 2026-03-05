# E-Commerce API — Deep Analysis Report

> **Generated:** 2026-03-02 · **Stack:** tRPC v11 · Drizzle ORM · Neon Postgres · Better Auth · Arcjet · Zod v3  
> **Entrypoints:** `/api/v1` (tRPC) · `/api/auth` (Better Auth) · `/api/blob/upload` (Vercel Blob)

---

## 📚 Document Navigation

| ← Previous | Index | Next → |
|------------|-------|--------|
| [02-architecture-review.md](./02-architecture-review.md) | [00-index.md](./00-index.md) | [04-form-audit.md](./04-form-audit.md) |

**Related Documents:**
- Architecture patterns → [02-architecture-review.md](./02-architecture-review.md)
- Security issues consolidated → [06-full-system-audit.md](./06-full-system-audit.md) §6
- Action plan for API gaps → [07-completion-roadmap.md](./07-completion-roadmap.md) Phase 2

---

## Legend

| Icon | Meaning |
|------|---------|
| ✅ | **Completed** — Fully implemented and working |
| 🟡 | **Partial** — Exists but has gaps, bugs, or inconsistencies |
| ❌ | **Missing** — Not implemented despite being planned or needed |

---

## Phase 1 — Core API Foundation

### 1.1 HTTP Route Handlers

| Status | Endpoint | Method | Purpose | Notes |
|--------|----------|--------|---------|-------|
| ✅ | `/api/v1/[[...rest]]` | GET, POST | tRPC fetch handler | Uses `fetchRequestHandler`, dev-only error logging |
| ✅ | `/api/auth/[...all]` | GET, POST | Better Auth handler | POST wrapped with Arcjet rate limiting |
| 🟡 | `/api/blob/upload` | POST | Vercel Blob file upload | **No auth guard** — anyone can upload files |
| ❌ | `/api/webhooks/*` | — | Payment webhook handlers | No Stripe/Razorpay webhook routes exist |

### 1.2 tRPC Infrastructure

| Status | Component | File | Notes |
|--------|-----------|------|-------|
| ✅ | Context factory | `api.methods.ts` | Injects `session`, `user`, `headers` from `getServerSession()` |
| ✅ | `publicProcedure` | `api.methods.ts` | No auth required |
| ✅ | `protectedProcedure` | `api.methods.ts` | Requires valid session (throws `UNAUTHORIZED`) |
| ✅ | `adminProcedure` | `api.methods.ts` | Requires `admin` role |
| ✅ | `customerProcedure` | `api.methods.ts` | Requires `admin` or `user` role |
| ✅ | Error formatter | `api.methods.ts` | Zod errors → `prettyZodError()` + field-level object |
| ✅ | SuperJSON transformer | `api.methods.ts` | Handles `Date`, `Map`, `Set` serialization |
| ✅ | Server caller | `api.server.tsx` | RSC data-fetching via `createCaller` |
| ✅ | Client provider | `api.client.tsx` | `httpBatchStreamLink` to `/api/v1` with logger |
| ✅ | Hydration helpers | `api.server.tsx` | `HydrateClient` for SSR → client hydration |
| 🟡 | `customerProcedure` | `api.methods.ts` | **Defined but never used** in any router |
| 🟡 | `adminProcedure` | `api.methods.ts` | **Defined but never used** — mutations use `protectedProcedure` (any logged-in user can create/edit/delete) |

### 1.3 API Response Utilities

| Status | Component | File | Notes |
|--------|-----------|------|-------|
| ✅ | `API_RESPONSE()` | `api.utils.ts` | Standard wrapper: `{ status, message, data }` |
| ✅ | `prettyZodError()` | `api.utils.ts` | Human-readable Zod error formatting |
| ✅ | `zodErrorObject()` | `api.utils.ts` | Field-level error mapping for forms |
| ✅ | `STATUS` constants | `api.config.ts` | `success`, `error`, `failed` |
| ✅ | `MESSAGE` constants | `api.config.ts` | Pre-defined for 12 modules (483 lines) |
| 🟡 | `API_RESPONSE` vs schema | — | **Runtime returns `{ status, message, data }` but Zod schemas expect `{ status, message, data, meta }` — `meta` field is never populated** |

---

## Phase 2 — Data Modeling (Drizzle Schema)

### 2.1 Implemented Tables

| Status | Table | Key Columns | Relations | Indexes | Soft Delete |
|--------|-------|-------------|-----------|---------|-------------|
| ✅ | `user` | id, email, role, banned, twoFactorEnabled | → account, session | — | No |
| ✅ | `account` | id, userId, providerId, accessToken | user ← | — | No |
| ✅ | `session` | id, token, userId, ipAddress, userAgent | user ← | — | No |
| ✅ | `verification` | id, identifier, value, expiresAt | — | — | No |
| ✅ | `two_factor` | id, secret, backupCodes, userId | user ← | — | No |
| ✅ | `passkey` | id, publicKey, userId, credentialID | user ← | — | No |
| ✅ | `rate_limit` | id, key, count, lastRequest | — | — | No |
| ✅ | `category` | id, slug, title, visibility, displayType, isFeatured | → subcategory | visibility, isFeatured, displayOrder | ✅ `deletedAt` |
| ✅ | `subcategory` | id, slug, categorySlug, title | category ←, → series | categorySlug, visibility, isFeatured | ✅ `deletedAt` |
| ✅ | `series` | id, slug, subcategorySlug, title | subcategory ←, → attribute, → product | subcategorySlug, visibility, isFeatured | ✅ `deletedAt` |
| ✅ | `attribute` | id, slug, seriesSlug, title, type, value | series ← | — | ✅ `deletedAt` |
| ✅ | `media` | id, url, alt, type | — | — | No |
| ✅ | `product` | id, slug, title, basePrice, status, categorySlug, subcategorySlug, seriesSlug | → productVariant | categorySlug, subcategorySlug, seriesSlug, status, isActive | ✅ `deletedAt` |
| ✅ | `product_variant` | id, slug, productId, priceModifierType/Value, attributes (JSON), media (JSON) | product ←, → inventoryItem | productId | ✅ `deletedAt` |
| ✅ | `inventory_item` | id, variantId, sku, barcode, quantity, incoming, reserved | productVariant ← | — | No |
| ✅ | `inventory_reservation` | id, inventoryId, userId, quantity, expiresAt | inventoryItem ← | — | No |
| ✅ | `cart` | id, userId, sessionId | user ←, → cartLine | — | No |
| ✅ | `cart_line` | id, cartId, variantId, quantity, price | cart ←, productVariant ← | — | No |
| ✅ | `wishlist` | id, userId, variantId | user ←, productVariant ← | — | No |

### 2.2 Missing Tables (Planned in Enums/Messages)

| Status | Table | Evidence | Impact |
|--------|-------|----------|--------|
| ✅ | `order` | `order` table + `orderStatusEnum` defined |
| ✅ | `order_item` | Implemented with `orderId`/`variantId` relations |
| ✅ | `payment` | `payment` table + `paymentStatusEnum` + `paymentProviderEnum` |
| ✅ | `shipment` | `shipment` table + `shipmentStatusEnum` |
| ❌ | `shipment_event` | Planned enterprise model only |
| ✅ | `address` | `address` table implemented with user relation |
| ✅ | `discount` / `coupon` | `discount` table and enums exist |
| ✅ | `order_discount` | Junction table implemented |
| ✅ | `review` | `review` table implemented |

### 2.3 Enterprise Tables (Post-MVP) 🏢

| Status | Table | Purpose | Business Value |
|--------|-------|---------|----------------|
| ❌ | `order_status_history` | Audit trail for order state changes | Compliance & debugging |
| ❌ | `order_audit_log` | Comprehensive order modification log | Security & support |
| ❌ | `refund` / `refund_item` | Refund lifecycle management | Customer service |
| ❌ | `tax_category` / `tax_rate` / `tax_rule` | Tax configuration | Legal compliance |
| ❌ | `product_relationship` / `bundle_component` | Cross-sell, upsell, bundles | Revenue optimization |
| ❌ | `loyalty_program` / `loyalty_tier` / `customer_loyalty` | Rewards system | Customer retention |
| ❌ | `cart_abandonment` / `abandonment_recovery` | Abandoned cart tracking | Revenue recovery |
| ❌ | `product_view` / `product_analytics_summary` | View analytics | Business intelligence |
| ❌ | `audit_log` / `audit_log_archive` | System-wide audit logging | Security & compliance |

### 2.4 Relation Issues

| Status | Issue | Location |
|--------|-------|----------|
| 🟡 | `series` → `product` relation exists in `seriesRelations` but `product` has no `seriesSlug` back-reference defined | `db.schema.ts:385` |
| ❌ | `inventory_item` has **no index** on `variantId` (1:1 lookup) | `db.schema.ts:291` |
| ❌ | `inventory_item` has **no index** on `sku` (unique, frequently queried) | `db.schema.ts:296` |
| ❌ | `cart` has **no index** on `userId` or `sessionId` | `db.schema.ts:317` |
| ❌ | `wishlist` has **no index** on `userId` | `db.schema.ts:336` |
| ❌ | `attribute` has **no index** on `seriesSlug` | `db.schema.ts:201` |

---

## Phase 3 — Validation Layer (Zod Schemas)

### 3.1 Contract Coverage

| Module | Schema File | Contract Defined | Router Uses Contract | Types Exported |
|--------|------------|-----------------|---------------------|---------------|
| ✅ Category | `category.schema.ts` | ✅ Full (8 endpoints) | ✅ All procedures | ❌ |
| ✅ Subcategory | `subcategory.schema.ts` | ✅ Full (5 endpoints) | ✅ All procedures | ✅ |
| ✅ Series | `series.schema.ts` | ✅ Full (4 endpoints) | ✅ All procedures | ❌ |
| ✅ Product | `product.schema.ts` | ✅ Full (8 endpoints) | ✅ All procedures | ❌ |
| ✅ ProductVariant | `product-variant.schema.ts` | ✅ Full (6 endpoints) | ✅ All procedures | ❌ |
| ✅ Inventory | `inventory.schema.ts` | ✅ Full (8 endpoints) | ✅ All procedures | ❌ |
| ✅ Attribute | `attribute.schema.ts` | ✅ Full (7 endpoints) | ✅ attribute router uses contract | ✅ |

### 3.2 Structural Issues

| Status | Issue | Severity | Details |
|--------|-------|----------|---------|
| 🟡 | **`detailedResponse` duplicated 7×** | Medium | Identical function copy-pasted into every schema file instead of shared |
| 🟡 | **`paginationSchema` duplicated 6×** | Medium | Same `{ limit, offset }` re-defined in every module |
| 🟡 | **`displayTypeEnum` duplicated 3×** | Low | Defined in category, subcategory, and series schemas |
| 🟡 | **`visibilityEnum` duplicated 3×** | Low | Same as above |
| 🟡 | **`z.any()` escape hatch** | Medium | `subcategory.schema.ts:92` — series data typed as `z.any()` to avoid circular dep |
| 🟡 | **Type mismatch: `priceModifierValue`** | High | Zod schema: `z.string()` · DB column: `numeric(10,2)` — potential parse errors |
| 🟡 | **`meta` field never populated** | Medium | All `detailedResponse` schemas include `meta?: { timestamp, version, count }` but `API_RESPONSE()` never returns it |
| ❌ | **`drizzle-zod` unused** | Medium | Installed as dependency but never imported — schemas are hand-written instead of generated from DB |

### 3.3 Input Naming Inconsistency

| Module | Create Input | Update Input | Delete Input |
|--------|-------------|-------------|-------------|
| Category | `body` | `params` + `body` | `params` |
| Subcategory | `body` | `params` + `body` | `params` |
| Series | `body` | `params` + `body` | `params` |
| Product | `body` | `params` + `body` | `params` |
| ProductVariant | `body` | `params` + `body` | `params` |
| Inventory | **`data`** ⚠️ | `params` + **`data`** ⚠️ | `params` |

> Inventory uses `data` instead of `body` — inconsistent with all other modules.

---

## Phase 4 — Business Logic (tRPC Routers)

### 4.1 Router Endpoint Matrix

| Router | get | getMany | getBySlug | create | update | delete | search | Special |
|--------|-----|---------|-----------|--------|--------|--------|--------|---------|
| ✅ category | ✅ pub | ✅ pub | — | ✅ prot | ✅ prot | ✅ prot (soft) | — | `getAllFeatured`, `getManyWithSubs`, `getManyByTypes`, `getCategoryWithSubCategories` |
| ✅ subcategory | — | ✅ pub | ✅ pub | ✅ prot | ✅ prot | ✅ prot (soft) | — | — |
| ✅ series | — | ✅ **prot** ⚠️ | — | ✅ prot | ✅ prot | ✅ prot (soft) | — | — |
| ✅ product | ✅ prot | ✅ prot | ✅ pub | ✅ prot | ✅ prot | ✅ prot (soft) | ✅ pub | `getProductsBySeriesSlug` (pub), `getPDPProductByVariant` (pub), `getProductWithVariants` (pub) |
| ✅ productVariant | ✅ prot | ✅ prot | ✅ prot | ✅ prot | ✅ prot | ✅ prot (soft) | — | Atomic create with inventory (transaction) |
| ✅ inventory | ✅ pub | ✅ pub | — | ✅ prot | ✅ prot | ✅ prot (**hard**) | ✅ pub | `getByVariantId`, `getBySku`, `updateStock` |
| ✅ attribute | — | ✅ pub (filterable) | — | ✅ prot | ✅ prot | ✅ prot | ✅ pub (search) | Series-scoped attributes |
| ✅ cart | ✅ pub (`get`) | ✅ prot (`getUserCart`) | — | ✅ pub (`add`) | ✅ pub (`update`) | ✅ pub (`remove`, `clear`) | — | `getTotals`, `merge` guest cart, inventory reservation |
| ✅ wishlist | ✅ prot (`get`) | — | — | ✅ prot (`add`) | — | ✅ prot (`remove`) | — | Variant + product join in response |
| ✅ order | ✅ prot (`get`) | ✅ prot (`getMany`) | — | ✅ prot (from cart, transactional) | ✅ prot (`updateStatus`) | — | — | Inventory deduction on placement |
| ✅ payment | — | — | — | ✅ pub (`createIntent`) | ✅ pub (`confirm`) | — | — | `getStatus` per order; gateway integration TODO |
| ✅ address | — | ✅ prot (`getMany`) | — | ✅ prot (`create`) | ✅ prot (`update`) | ✅ prot (`delete`) | — | `setDefault` with ownership checks |
| ✅ shipment | — | — | — | ✅ prot (`create`) | ✅ prot (`updateStatus`) | — | — | `getByOrder` public lookup |

### 4.2 Auth Guard Issues

| Status | Issue | Impact |
|--------|-------|--------|
| 🟡 | **Series `getMany` is `protectedProcedure`** | Store pages fetching series data will fail for logged-out users |
| 🟡 | **All mutations use `protectedProcedure`** (any authenticated user) | Any logged-in customer can create/edit/delete categories, products, and inventory — should use `adminProcedure` |
| 🟡 | **`adminProcedure` defined but never used** | No endpoint is admin-restricted despite the admin role system |
| 🟡 | **`customerProcedure` defined but never used** | Commerce operations should require `customerProcedure` |
| ❌ | **Blob upload has no auth guard** | `/api/blob/upload` accepts any request — potential abuse vector |
| 🟡 | **Permission check bug** in `auth.server.ts:26-30` | `getServerUserPermission` checks `!has.error` (inverted logic) — always returns `false` |

### 4.3 Query Safety Issues

| Status | Issue | Location | Details |
|--------|-------|----------|---------|
| 🟡 | **No soft-delete filter on category.get** | `category.api.ts:17-23` | Returns deleted categories (no `isNull(deletedAt)` check) |
| 🟡 | **No soft-delete filter on category.getMany** | `category.api.ts:43` | Same — returns deleted items in listing |
| 🟡 | **No soft-delete filter on subcategory.getMany** | `subcategory.api.ts:22` | Same |
| 🟡 | **No soft-delete filter on subcategory.getBySlug** | `subcategory.api.ts:48` | Same |
| 🟡 | **Unused existence check in inventory.delete** | `inventory.api.ts:199` | Queries `findFirst` but ignores the result — deletes regardless |
| ✅ | **Product router filters soft-deleted** | `product.api.ts` | All queries include `isNull(deletedAt)` |
| ✅ | **Series router filters soft-deleted** | `series.api.ts` | `getMany` includes `isNull(deletedAt)` |
| 🟡 | **Inventory uses hard-delete** | `inventory.api.ts:204` | Only module using `db.delete()` — inconsistent with soft-delete pattern |
| 🟡 | **No duplicate slug check on subcategory.create** | `subcategory.api.ts:68` | Relies on DB unique constraint — no user-friendly error message |
| 🟡 | **No duplicate slug check on series.create** | `series.api.ts:43` | Same |
| 🟡 | **SQL injection safe** | All routers | ✅ All queries use parameterized Drizzle builders |

### 4.4 Transaction Usage

| Status | Router | Operation | Uses Transaction |
|--------|--------|-----------|-----------------|
| ✅ | productVariant | `create` | ✅ `db.transaction()` — atomic variant + inventory |
| ❌ | product | `delete` | ❌ Should also delete variants and inventory atomically |
| ❌ | category | `delete` | ❌ Should cascade soft-delete to subcategories, series, products |
| ❌ | subcategory | `delete` | ❌ Should cascade soft-delete to series and products |
| ❌ | series | `delete` | ❌ Should cascade soft-delete to products |

---

## Phase 5 — Security

### 5.1 Authentication

| Status | Feature | Notes |
|--------|---------|-------|
| ✅ | Email/password auth | With email verification required |
| ✅ | GitHub OAuth | Configured and functional |
| ✅ | Two-factor (TOTP) | Via `better-auth/plugins/two-factor` |
| ✅ | Passkey / WebAuthn | Via `better-auth/plugins/passkey` |
| ✅ | Session management | Cookie-cached (1hr), DB-backed |
| ✅ | Account impersonation | Admin plugin supports it |
| ✅ | User banning | `banned`, `banReason`, `banExpires` columns |

### 5.2 Rate Limiting & Bot Protection

| Status | Feature | Notes |
|--------|---------|-------|
| ✅ | Auth rate limiting | Arcjet on `/api/auth` POST — 10 req/10min (sign-in/sign-up), 60 req/1min (other) |
| ✅ | Shield protection | Arcjet `shield({ mode: 'LIVE' })` on auth routes |
| ✅ | Email validation | Blocks disposable, invalid, no-MX emails on signup |
| ✅ | Bot detection allow-list | Allows `STRIPE_WEBHOOK` bot type |
| ✅ | Better Auth rate limiting | Database-backed via `rate_limit` table |
| ❌ | **tRPC route rate limiting** | `/api/v1` has **no Arcjet or rate limiting** — all tRPC endpoints unprotected |
| ❌ | **Blob upload rate limiting** | `/api/blob/upload` has no rate limiting |

### 5.3 Authorization Gaps

| Status | Gap | Risk |
|--------|-----|------|
| ❌ | **No RBAC enforcement on mutations** | Any authenticated user can CRUD all catalog data |
| ❌ | **No ownership checks** | User A can modify User B's resources (when commerce APIs are built) |
| ❌ | **No CSRF protection** on blob upload | Standard `POST` without tRPC's built-in protection |
| 🟡 | **Commented-out Arcjet code** | `arkjet.config.ts:87-124` — 38 lines of dead code |

### 5.4 Environment & Secrets

| Status | Issue | Notes |
|--------|-------|-------|
| 🟡 | **No runtime env validation** | `@t3-oss/env-nextjs` installed but **not used** — `env.server.ts` just wraps `process.env` with `String()` |
| 🟡 | **Boolean coercion bug** | `Boolean(process.env.SKIP_ENV_VALIDATION)` — the string `"false"` evaluates to `true` |
| 🟡 | **`.env` contains real secrets** | Production DB URL, OAuth secrets, Resend API key in repo — should use `.env.example` pattern |
| 🟡 | **Typo in env var** | `.env:26` — `ARKJET_API_KEY` (typo, should be `ARCJET_API_KEY`) — matches `serverEnv.ARKJET_API_KEY` so it works, but inconsistent with `ARCJET_ENV` on next line |

---

## Phase 6 — Performance & Optimization

### 6.1 Database Performance

| Status | Feature | Notes |
|--------|---------|-------|
| ✅ | Connection pooling | Neon serverless pooler (`-pooler` suffix in URL) |
| ✅ | Indexes on category lookups | `visibility`, `isFeatured`, `displayOrder` |
| ✅ | Indexes on product lookups | `categorySlug`, `subcategorySlug`, `seriesSlug`, `status`, `isActive` |
| ❌ | **Missing indexes** | `inventory_item.variantId`, `inventory_item.sku`, `cart.userId`, `wishlist.userId`, `attribute.seriesSlug` |
| ❌ | **No query result limits** | Several queries (e.g., `getManyByTypes`) fetch unbounded result sets |
| ❌ | **No `COUNT(*)` for pagination** | No total count returned — clients can't show "page X of Y" |

### 6.2 API Performance

| Status | Feature | Notes |
|--------|---------|-------|
| ✅ | `httpBatchStreamLink` | Batches multiple tRPC calls into single HTTP request |
| ✅ | React `cache()` | `getServerSession` and `createContext` are cached per request |
| 🟡 | **N+1 in `getManyByTypes`** | `category.api.ts:117-139` — 6 separate DB queries (featured, public, private, hidden, recent, deleted) instead of a single query with grouping |
| 🟡 | **No cursor pagination** | All pagination uses `limit`/`offset` — degrades for large datasets |
| ❌ | **No query caching** | No `staleTime` or `cacheTime` configured on React Query client |
| ❌ | **No ETags / conditional requests** | No HTTP caching headers on any response |

---

## Phase 7 — Testing

### 7.1 Test Coverage

| Status | Type | Notes |
|--------|------|-------|
| ❌ | Unit tests | No test framework configured (no Jest, Vitest, etc.) |
| ❌ | API integration tests | No tRPC router tests |
| ❌ | Schema validation tests | No tests for Zod contracts |
| ❌ | E2E tests | No Playwright/Cypress |
| ❌ | Load testing | No k6/Artillery scripts |

---

## Registered Routers vs Planned Modules

This table maps every module found in `MESSAGE` constants and `PATH` routes against actual implementation:

| Module | DB Table | Zod Schema | tRPC Router | API Messages | Routes | Status |
|--------|----------|-----------|-------------|-------------|--------|--------|
| Category | ✅ | ✅ | ✅ | ✅ | ✅ | **✅ Complete** |
| Subcategory | ✅ | ✅ | ✅ | ✅ | ✅ | **✅ Complete** |
| Series | ✅ | ✅ | ✅ | ✅ | ✅ | **✅ Complete** |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ | **✅ Complete** |
| ProductVariant | ✅ | ✅ | ✅ | ✅ | ✅ | **✅ Complete** |
| Inventory | ✅ | ✅ | ✅ | ❌ inline | ✅ | **🟡 No message constants** |
| Attribute | ✅ | ✅ | ✅ | ❌ | ❌ | **🟡 API exists, messages/routes pending** |
| User | ✅ | ❌ | ❌ | ✅ | ✅ | **🟡 Auth-managed only** |
| Cart | ✅ | ✅ | ✅ | ✅ | ✅ | **🟡 API complete, UI pending** |
| Wishlist | ✅ | ✅ | ✅ | ✅ | ✅ | **🟡 API complete, UI pending** |
| Order | ✅ | ✅ | ✅ | ✅ | ✅ | **🟡 Core API complete, admin UI pending** |
| Address | ✅ | ✅ | ✅ | ✅ | ✅ | **🟡 API complete, UI pending** |
| Shipment | ✅ | ✅ | ✅ | ✅ | ✅ | **🟡 API complete, carrier integration pending** |
| Payment | ✅ | ✅ | ✅ | ❌ | ✅ | **🟡 API complete, gateway/webhooks pending** |
| Discount | ✅ | ❌ | ❌ | ✅ | ✅ | **❌ Not implemented (API/UI)** |
| Review | ✅ | ❌ | ❌ | ✅ | ✅ | **❌ Not implemented (API/UI)** |

---

## API Maturity Summary

### Maturity Level: **Middleware Development (~75% API-complete)**

> [!IMPORTANT]
> The catalog/admin APIs are production-quality in structure, and the core commerce APIs (cart, order, payment, address, wishlist, shipment, attribute) now exist with Zod contracts and Drizzle-backed implementations. The remaining gaps are checkout UI, payment gateway/webhook integration, and admin/customer experiences on top of these routers.

### Completion Breakdown

| Layer | Score | Notes |
|-------|-------|-------|
| Infrastructure | **90%** | tRPC, auth, DB, response wrapper all solid |
| Data Model | **80%** | Core commerce and enterprise tables implemented; some enterprise-only tables still planned |
| Validation | **75%** | Commerce contracts added; some duplication and a few modules still schema-less |
| Business Logic | **60%** | Catalog + inventory + core commerce routers implemented; checkout/payment flows still incomplete |
| Security | **45%** | Auth excellent; RBAC not enforced; tRPC unprotected; blob upload open |
| Performance | **35%** | Missing indexes, no pagination counts, N+1 queries |
| Testing | **0%** | Nothing exists |

### Structural Risks

> [!CAUTION]
> 1. **No RBAC on mutations** — any logged-in user can create/modify/delete catalog data via tRPC
> 2. **Permission check bug** — `getServerUserPermission()` has inverted error logic (always returns `false`)
> 3. **Boolean env coercion** — `Boolean("false")` is `true` in JavaScript — affects `SKIP_ENV_VALIDATION` and `USE_DEBUG_LOGS`
> 4. **Blob upload is unprotected** — no auth, no rate limiting, no file size/type validation
> 5. **Soft-delete filters inconsistent** — category/subcategory queries return deleted records; product/series correctly filter them
> 6. **No cascading deletes** — soft-deleting a category leaves orphaned subcategories, series, and products
> 7. **`priceModifierValue` type mismatch** — Zod string vs DB numeric may cause silent data corruption

### Minimum Steps to Production-Ready API

> [!WARNING]
> **Critical path (ordered by dependency):**

1. **Fix security holes** — Add auth guard to blob upload, switch mutations to `adminProcedure`, fix permission check inversion
2. **Add missing DB tables** — `order`, `order_item`, `payment`, `shipment`, `address` (with migration)
3. **Create shared schemas** — Extract `detailedResponse`, `paginationSchema`, enums into `@/shared/schema/`
4. **Build cart API** — tRPC router with add/remove/update/clear + session-based guest cart
5. **Build order API** — Create order from cart, status transitions, admin listing
6. **Build payment API** — Stripe/Razorpay integration, webhook handler, payment recording
7. **Add missing indexes** — `inventory_item(variantId)`, `inventory_item(sku)`, `cart(userId)`, `wishlist(userId)`, `attribute(seriesSlug)`
8. **Fix soft-delete gaps** — Add `isNull(deletedAt)` to all category/subcategory queries
9. **Add cascading soft-deletes** — Wrap category/subcategory/series deletes in transactions
10. **Implement `@t3-oss/env-nextjs`** — Replace manual `String()` wrappers with proper runtime validation
11. **Add rate limiting to tRPC** — Arcjet middleware on `/api/v1` route
12. **Write integration tests** — At minimum for auth flow and all CRUD operations
