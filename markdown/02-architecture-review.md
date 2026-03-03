# Architecture Review Report

**Project:** E-Commerce Application  
**Date:** March 2, 2026  
**Framework:** Next.js 16 + React 19 + TypeScript  
**Database:** PostgreSQL (Neon) + Drizzle ORM  
**API:** tRPC 11 + TanStack Query  
**Auth:** Better-Auth  

---

## 📚 Document Navigation

| ← Previous | Index | Next → |
|------------|-------|--------|
| [01-project-plan.md](./01-project-plan.md) | [00-index.md](./00-index.md) | [03-api-analysis.md](./03-api-analysis.md) |

**Related Documents:**
- Form system details → [04-form-audit.md](./04-form-audit.md)
- UI-Data alignment issues → [05-ui-data-alignment.md](./05-ui-data-alignment.md)
- Action plan → [07-completion-roadmap.md](./07-completion-roadmap.md)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture Overview](#current-architecture-overview)
3. [Module Relationships](#module-relationships)
4. [Strengths](#strengths)
5. [Structural Issues](#structural-issues)
6. [Reusability & Consistency Gaps](#reusability--consistency-gaps)
7. [Refactoring Opportunities](#refactoring-opportunities)
8. [Scalability Risks](#scalability-risks)
9. [Recommended Improvements Roadmap](#recommended-improvements-roadmap)

---

## Executive Summary

This architecture review analyzes an e-commerce application built with modern React/Next.js stack. The codebase demonstrates strong foundational patterns with clear module separation, type-safe APIs via tRPC, and consistent schema-first validation using Zod. However, several architectural inconsistencies, tight coupling patterns, and missing abstraction layers have been identified that could impact long-term maintainability and scalability.

**Overall Grade:** B+ (Good foundations with room for improvement)

---

## Current Architecture Overview

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (account)/          # Account-related routes
│   ├── (auth)/             # Authentication routes
│   ├── (site)/             # Public site routes
│   ├── (store)/            # Store/catalog routes
│   └── (studio)/           # Admin dashboard routes
├── core/                   # Core infrastructure
│   ├── api/                # tRPC setup & procedures
│   ├── auth/               # Better-auth configuration
│   ├── db/                 # Database connection & schema
│   ├── query/              # TanStack Query providers
│   ├── theme/              # Theme configuration
│   └── mail/               # Email templates/methods
├── module/                 # Feature modules
│   ├── account/
│   ├── attribute/          # ⚠️ NO API - Schema only
│   ├── auth/               # Authentication UI
│   ├── cart/               # ⚠️ Schema only - No API
│   ├── category/           # ✅ Full CRUD + UI
│   ├── cookies/            # Cookie consent
│   ├── discount/           # 🏢 Enterprise - Schema defined
│   ├── inventory/          # ✅ Full CRUD + UI
│   ├── legal/              # Legal pages
│   ├── loyalty/            # 🏢 Enterprise - Not implemented
│   ├── order/              # ❌ Critical - Not implemented
│   ├── payment/            # ❌ Critical - Not implemented
│   ├── product/            # ✅ Full CRUD + UI
│   ├── product-analytics/  # 🏢 Enterprise - Not implemented
│   ├── product-variant/    # ✅ Full CRUD + UI
│   ├── refund/             # 🏢 Enterprise - Not implemented
│   ├── review/             # 🏢 Enterprise - Schema defined
│   ├── series/             # ✅ Full CRUD
│   ├── shipment/           # 🏢 Enterprise - Schema defined
│   ├── site/               # Site-wide components
│   ├── subcategory/        # ✅ Full CRUD
│   ├── tax/                # 🏢 Enterprise - Not implemented
│   └── user/               # ⚠️ NO API - Directory only
│   └── wishlist/           # ⚠️ Schema only - No APIs
└── shared/                 # Shared utilities
    ├── components/         # UI components & forms
    ├── config/             # Configuration files
    ├── schema/             # Shared schemas
    ├── styles/             # Global styles
    ├── types/              # Global types
    └── utils/              # Utility functions
```

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.0.0 |
| UI Library | React | 19.2.0 |
| Language | TypeScript | 5.x |
| Database | PostgreSQL (Neon) | - |
| ORM | Drizzle ORM | 0.44.7 |
| API | tRPC | 11.0.0 |
| State Management | TanStack Query | 5.90.6 |
| Auth | Better-Auth | 1.3.32 |
| Validation | Zod | 3.25.1 |
| Styling | Tailwind CSS | 4.x |
| UI Components | Radix UI | Latest |

---

## Module Relationships

### Data Flow Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   UI Layer      │────▶│   tRPC API   │────▶│  Database Layer │
│   (Components)  │     │   (Routers)  │     │   (Drizzle ORM) │
└─────────────────┘     └──────────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Forms         │     │   Schema     │     │   Auth Layer    │
│   (React Hook)  │     │   (Zod)      │     │   (Better-Auth) │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

### Module Dependencies

```
core/api/
├── categoryRouter      ◄── module/category/
├── subcategoryRouter   ◄── module/subcategory/
├── seriesRouter        ◄── module/series/
├── productRouter       ◄── module/product/
├── productVariantRouter ◄── module/product-variant/
└── inventoryRouter     ◄── module/inventory/
```

Each module typically contains:
- `*.api.ts` - tRPC router with CRUD operations
- `*.schema.ts` - Zod schemas for validation
- `*.types.ts` - TypeScript type definitions
- `*.tsx` - UI components (forms, cards, lists)

### Enterprise Module Architecture 🏢

**Post-MVP modules** extending the platform into enterprise territory:

```
module/
├── shipment/              # 🏢 Fulfillment & tracking
│   ├── shipment.api.ts
│   ├── shipment.schema.ts
│   └── shipment-carrier.integration.ts
├── discount/              # 🏢 Promotions & coupons
│   ├── discount.api.ts
│   ├── discount.schema.ts
│   └── discount-validation.service.ts
├── review/                # 🏢 Product reviews
│   ├── review.api.ts
│   ├── review.schema.ts
│   └── review-moderation.service.ts
├── refund/                # 🏢 Refund lifecycle
│   ├── refund.api.ts
│   ├── refund.schema.ts
│   └── refund-processing.service.ts
├── tax/                   # 🏢 Tax configuration
│   ├── tax.api.ts
│   ├── tax.schema.ts
│   ├── tax-calculation.engine.ts
│   └── tax-provider.integration.ts
├── loyalty/               # 🏢 Rewards program
│   ├── loyalty.api.ts
│   ├── loyalty.schema.ts
│   ├── points-calculation.engine.ts
│   └── tier-management.service.ts
└── product-analytics/     # 🏢 View tracking & analytics
    ├── analytics.api.ts
    ├── analytics.schema.ts
    ├── event-collector.middleware.ts
    └── aggregation.service.ts
```

**Key Architectural Patterns for Enterprise:**
1. **Event-Driven Updates** — Audit logs, analytics, loyalty points triggered by events
2. **Service Layer** — Complex business logic (tax calculation, loyalty tiers)
3. **Integration Abstractions** — Carrier APIs, tax providers, payment gateways
4. **Data Retention Policies** — Audit archives, analytics aggregation

---

## Strengths

### 1. **Well-Defined Module Boundaries**
- Clear separation between core, modules, and shared layers
- Each feature module is self-contained with its own API, schema, and components

### 2. **Type-Safe API Layer**
- tRPC provides end-to-end type safety
- Consistent use of `protectedProcedure` and `publicProcedure`
- Proper input/output schema validation with Zod

### 3. **Comprehensive Schema-First Validation**
- All API endpoints use Zod contracts
- Consistent response format with `API_RESPONSE` wrapper
- Proper error handling with typed error responses

### 4. **Reusable Form Architecture**
- Centralized form system in `shared/components/form/`
- Dynamic field loading with Next.js dynamic imports
- Consistent validation integration with react-hook-form + Zod

### 5. **Database Design**
- Well-structured schema with proper relations
- Soft delete pattern consistently applied
- Proper indexing on frequently queried fields
- Enum types for constrained values

### 6. **Authentication Architecture**
- Better-Auth provides comprehensive auth features
- Role-based access control (admin/user)
- Session management with cookie cache

### 7. **Code Organization**
- Route groups in App Router for logical separation
- Centralized configuration files
- Consistent file naming conventions

---

## Structural Issues

### 1. **Inconsistent Soft Delete Implementation**

**Issue:** Soft delete logic is implemented differently across modules.

```typescript
// category.api.ts - Missing slug update on delete
await db.update(category).set({ deletedAt: new Date() })

// product.api.ts - Proper slug update
await db.update(product).set({
  deletedAt: now,
  updatedAt: now,
  slug: `${existing.slug}-deleted-${Date.now()}`,
  isActive: false,
})
```

**Impact:** Inconsistent data integrity and potential slug conflicts.

**Severity:** MEDIUM

### 2. **Duplicated Response Handling Logic**

**Issue:** Every API endpoint manually constructs the same response pattern.

```typescript
// Repeated pattern in every router:
return API_RESPONSE(
  output ? STATUS.SUCCESS : STATUS.FAILED,
  output ? MESSAGE.CATEGORY.GET.SUCCESS : MESSAGE.CATEGORY.GET.FAILED,
  output ?? null,
)
```

**Impact:** Violates DRY principle; harder to maintain consistent API behavior.

**Severity:** LOW

### 3. **Missing Service Layer**

**Issue:** Business logic is directly in API route handlers (tRPC procedures).

```typescript
// Current pattern - business logic in router
export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(categoryContract.create.input)
    .mutation(async ({ input }) => {
      // Business logic directly here
      const [output] = await db.insert(category).values({...})
      return API_RESPONSE(...)
    }),
})
```

**Impact:** Difficult to unit test, reuse logic, or swap implementations.

**Severity:** MEDIUM

### 4. **Inconsistent Error Handling**

**Issue:** Some modules use `debugError`, others don't. Error messages are sometimes hardcoded, sometimes from config.

```typescript
// category.api.ts - Uses MESSAGE config
debugError('CATEGORY:UPDATE:ERROR', err)
return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.UPDATE.ERROR, null, err as Error)

// inventory.api.ts - Hardcoded messages
return API_RESPONSE(STATUS.ERROR, 'Error fetching inventory', null, err as Error)
```

**Severity:** LOW

### 5. **Tight Coupling to Database Schema**

**Issue:** Modules import directly from `core/db/db.schema` instead of through an abstraction.

```typescript
// All modules do this:
import { category } from '@/core/db/db.schema'
```

**Impact:** Hard to mock for testing, difficult to change schema structure.

**Severity:** MEDIUM

### 6. **Inconsistent Module Structure**

**Issue:** Some modules have organized subdirectories, others are flat.

```
module/
├── category/              # Flat structure
├── product/               # Flat structure  
├── inventory/             # Flat structure
└── (others follow similar flat pattern)
```

**Severity:** LOW

### 7. **Missing Repository Pattern**

**Issue:** Direct database queries scattered throughout API files.

**Impact:** No centralized data access layer, difficult to optimize queries globally.

**Severity:** MEDIUM

### 8. **Inconsistent Type Exports**

**Issue:** Some types are exported from schema files, others from dedicated types files.

```typescript
// product.schema.ts
export const productSelectSchema = baseProductSchema
// Types inferred from schema

// product.types.ts
export type ProductWithVariants = {
  // Custom types
}
```

**Severity:** LOW

---

## Reusability & Consistency Gaps

### 1. **No Shared Pagination Logic**

**Issue:** Pagination parameters are repeated in every schema.

```typescript
// Duplicated in product.schema.ts, category.schema.ts, etc.
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})
```

**Recommendation:** Create shared pagination schemas in `shared/schema/`.

### 2. **Missing Generic CRUD Hook**

**Issue:** Each module implements its own create/update/delete mutations.

**Recommendation:** Create reusable React hooks for common CRUD operations.

### 3. **No Centralized API Response Type**

**Issue:** `detailedResponse` function is duplicated across schema files.

**Recommendation:** Move to `shared/schema/api.schema.ts`.

### 4. **Inconsistent Slug Generation**

**Issue:** Slug generation logic is duplicated and inconsistent.

```typescript
// product.api.ts
const slug = body.slug ?? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

// category.api.ts
slug: input.body.slug ?? input.body.title.toLowerCase().replace(/\s+/g, '-')
```

**Recommendation:** Create shared slug utilities.

### 5. **Missing Shared Date Utilities**

**Issue:** `new Date()` and date formatting scattered throughout.

**Recommendation:** Use `date-fns` consistently with shared utilities.

### 6. **No Common Search/Filter Pattern**

**Issue:** Search implementations vary between modules.

**Recommendation:** Create shared search/filter schema and utilities.

---

## Refactoring Opportunities

### High Priority

#### 1. **Introduce Service Layer**

Create a service layer between API and database:

```typescript
// module/category/category.service.ts
export class CategoryService {
  constructor(private db: Database) {}
  
  async create(data: CreateCategoryInput) {
    // Business logic here
  }
  
  async findById(id: string) {
    // Data access here
  }
}

// module/category/category.api.ts
export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(categoryContract.create.input)
    .mutation(async ({ input, ctx }) => {
      const service = new CategoryService(ctx.db)
      return service.create(input.body)
    }),
})
```

**Benefits:**
- Unit testable business logic
- Swappable implementations
- Centralized transaction handling

#### 2. **Create Repository Pattern**

```typescript
// shared/db/repositories/base.repository.ts
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected db: Database,
    protected table: PgTable
  ) {}
  
  async findById(id: string): Promise<T | null>
  async findMany(options: QueryOptions): Promise<T[]>
  async create(data: CreateInput): Promise<T>
  async update(id: string, data: UpdateInput): Promise<T>
  async softDelete(id: string): Promise<void>
}

// module/category/category.repository.ts
export class CategoryRepository extends BaseRepository<Category, CreateCategoryInput, UpdateCategoryInput> {
  constructor(db: Database) {
    super(db, category)
  }
  
  async findBySlug(slug: string) {
    return this.db.query.category.findFirst({
      where: eq(category.slug, slug)
    })
  }
}
```

#### 3. **Standardize Soft Delete Pattern**

Create a shared soft delete utility:

```typescript
// shared/db/utils/soft-delete.ts
export async function softDelete<T extends { slug: string }>(
  db: Database,
  table: PgTable,
  id: string,
  options?: { updateSlug?: boolean }
) {
  const now = new Date()
  const updateData: any = {
    deletedAt: now,
    updatedAt: now,
    isActive: false,
  }
  
  if (options?.updateSlug) {
    const [existing] = await db.select().from(table).where(eq(table.id, id)).limit(1)
    if (existing) {
      updateData.slug = `${existing.slug}-deleted-${Date.now()}`
    }
  }
  
  return db.update(table).set(updateData).where(eq(table.id, id)).returning()
}
```

### Medium Priority

#### 4. **Create Shared API Response Utilities**

```typescript
// shared/schema/api.schema.ts
export function createApiResponse<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    status: z.enum(['success', 'error', 'failed']),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z.object({
      timestamp: z.date().default(() => new Date()),
      version: z.string().default('1.0.0'),
    }).optional(),
  })
}

export const successResponse = <T>(data: T, message: string) => ({
  status: 'success' as const,
  message,
  data,
})

export const errorResponse = (message: string, error?: Error) => ({
  status: 'error' as const,
  message,
  data: null,
  error: error?.message,
})
```

#### 5. **Implement Shared Pagination Schema**

```typescript
// shared/schema/pagination.schema.ts
export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

export const paginationWithSearchSchema = paginationSchema.extend({
  search: z.string().min(2).max(100).optional(),
})

export type PaginationInput = z.infer<typeof paginationSchema>

export function createPaginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number(),
    hasMore: z.boolean(),
    nextOffset: z.number().optional(),
  })
}
```

#### 6. **Standardize Slug Utilities**

```typescript
// shared/utils/lib/slug.utils.ts
import { v4 as uuidv4 } from 'uuid'

export function generateSlug(title: string, unique = true): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return unique ? `${base}-${Date.now()}` : base
}

export function generateDeletedSlug(originalSlug: string): string {
  return `${originalSlug}-deleted-${Date.now()}`
}
```

### Low Priority

#### 7. **Create Module Generator/Templates**

Document the standard module structure:

```
module/[feature]/
├── [feature].api.ts          # tRPC router
├── [feature].schema.ts        # Zod schemas
├── [feature].types.ts         # TypeScript types
├── [feature].service.ts       # Business logic (new)
├── [feature].repository.ts    # Data access (new)
├── [feature]-form.tsx        # Create/edit form
├── [feature]-card.tsx         # Display card
├── [feature]-list.tsx         # List component
└── [feature]-delete.tsx        # Delete confirmation
```

#### 8. **Centralize Error Messages**

```typescript
// shared/config/messages.ts
export const createCrudMessages = (entityName: string) => ({
  CREATE: {
    SUCCESS: `${entityName} created successfully.`,
    FAILED: `Failed to create ${entityName.toLowerCase()}.`,
    ERROR: `Unexpected error while creating ${entityName.toLowerCase()}.`,
  },
  // ... etc
})

export const CATEGORY_MESSAGES = createCrudMessages('Category')
export const PRODUCT_MESSAGES = createCrudMessages('Product')
```

---

## Scalability Risks

### 1. **Database Connection Pooling**

**Risk:** Single connection pool configuration without environment-specific tuning.

**Mitigation:** Configure connection pooling based on deployment environment.

### 2. **N+1 Query Risk**

**Risk:** Relations are fetched in separate queries without proper batching.

**Example:**
```typescript
// Current - potential N+1
const products = await db.query.product.findMany({
  with: { variants: true }  // This is fine (batched)
})

// But manual loops create N+1
for (const product of products) {
  const inventory = await db.query.inventoryItem.findFirst({...}) // N+1!
}
```

**Mitigation:** Use DataLoader pattern or ensure all relations are fetched in initial query.

### 3. **Image Upload Handling**

**Risk:** Image uploads in form fields use dynamic loading which may not handle large files well.

**Mitigation:** Implement chunked upload or direct-to-storage upload patterns.

### 4. **Session Management**

**Risk:** Session cache is set to 1 hour (`MAX_AGE = 60 * 60`), which may cause issues with high traffic.

**Mitigation:** Review and tune session management for production load.

### 5. **API Rate Limiting**

**Risk:** Rate limiting is configured but may not be sufficient for production.

**Mitigation:** Implement per-endpoint rate limiting and consider CDN-level protection.

---

## Recommended Improvements Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Establish core patterns without major refactoring

1. **Create shared utilities**
   - `shared/utils/lib/slug.utils.ts` - Slug generation
   - `shared/schema/pagination.schema.ts` - Pagination schemas
   - `shared/schema/api.schema.ts` - Response utilities

2. **Standardize soft delete**
   - Create `shared/db/utils/soft-delete.ts`
   - Update all modules to use shared utility

3. **Document module structure**
   - Create module generator documentation
   - Establish naming conventions

### Phase 2: Abstraction Layer (Weeks 3-4)

**Goal:** Reduce coupling and improve testability

1. **Implement Repository Pattern**
   - Create `shared/db/repositories/base.repository.ts`
   - Migrate one module as proof of concept
   - Gradually migrate remaining modules

2. **Introduce Service Layer**
   - Create service classes for complex modules (Product, Order)
   - Move business logic from API handlers
   - Add unit tests for services

3. **Standardize error handling**
   - Use `MESSAGE` config consistently
   - Add error logging to all modules

### Phase 3: Optimization (Weeks 5-6)

**Goal:** Performance and scalability improvements

1. **Query optimization**
   - Audit all queries for N+1 issues
   - Add DataLoader where needed
   - Optimize pagination queries

2. **Caching strategy**
   - Implement Redis for session storage
   - Add query result caching
   - Configure CDN for static assets

3. **Monitoring & Logging**
   - Add structured logging
   - Implement performance monitoring
   - Set up error tracking

### Phase 4: Advanced Features (Weeks 7-8)

**Goal:** Enterprise-grade architecture

1. **Event-driven architecture**
   - Implement event bus for decoupled operations
   - Add async job processing
   - Create webhook system

2. **API versioning**
   - Plan API versioning strategy
   - Implement backward compatibility
   - Document API changes

3. **Multi-tenancy support**
   - Design tenant isolation strategy
   - Implement tenant context
   - Add tenant-aware queries

---

## Conclusion

The e-commerce codebase has a solid foundation with modern technologies and clear module separation. The main areas for improvement are:

1. **Adding abstraction layers** (service/repository patterns)
2. **Standardizing common patterns** (pagination, soft delete, error handling)
3. **Improving testability** through dependency injection
4. **Optimizing for scale** (query optimization, caching)

The recommended roadmap provides a phased approach to address these issues without disrupting ongoing development. Priority should be given to establishing shared utilities and patterns (Phase 1) before moving to larger architectural changes.

**Immediate Actions:**
1. Create shared slug and pagination utilities
2. Standardize soft delete implementation
3. Document module structure guidelines
4. Plan repository pattern implementation for next sprint

---

*Generated by Architecture Review Tool*  
*Date: March 2, 2026*
