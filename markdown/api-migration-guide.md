# API System Migration Guide

> **Phase 0: Shared Infrastructure Alignment** ✅ COMPLETED  
> **Completed:** March 3, 2026  
> **Goal:** Align all shared schemas/utilities with existing API patterns while maintaining 100% backward compatibility

---

## Summary of Changes ✅ COMPLETE

All shared infrastructure files have been aligned with existing module patterns. **No breaking changes** - existing APIs continue to work without modification.

**Completion Date:** March 3, 2026

---

## New Shared Files Created

### Schema Layer (`@/shared/schema/`)

| File | Exports | Purpose |
|------|---------|---------|
| `pagination.schema.ts` | `paginationInput`, `offsetPaginationSchema`, `paginationMetaSchema`, `calculateOffset()` | Unified pagination patterns |
| `api.schema.ts` | `detailedResponse`, `metaResponse`, `successResponse`, `errorResponse` | Standard API response wrappers |
| `common.schema.ts` | `idSchema`, `slugSchema`, `softDeleteSchema`, `seoSchema`, `timestampSchema` | Reusable entity schemas |
| `enums.schema.ts` | `orderStatusEnum`, `paymentStatusEnum`, `productStatusEnum`, etc. | Shared enum definitions |

### Utility Layer (`@/shared/utils/lib/`)

| File | Exports | Purpose |
|------|---------|---------|
| `slug.utils.ts` | `generateSlug()`, `generateDeletedSlug()`, `isValidSlug()` | URL-friendly slug generation |
| `soft-delete.utils.ts` | `softDeleteFilter()`, `withSoftDelete()`, `buildSoftDeleteData()` | Soft delete query helpers |

### DB Utilities (`@/core/db/utils/`)

| File | Exports | Purpose |
|------|---------|---------|
| `query.utils.ts` | `buildPagination()`, `buildSearch()`, `buildOrderBy()` | Drizzle query builders |

---

## Barrel Export (Single Import Point)

**`@/shared/schema/common.ts`** now exports everything:

```typescript
// Import all shared schemas and utilities from one place
import {
  // Schemas
  detailedResponse,
  paginationInput,
  idSchema,
  slugSchema,
  softDeleteSchema,
  orderStatusEnum,
  
  // Utilities
  generateSlug,
  softDeleteFilter,
  withSoftDelete,
  buildPagination,
  buildSearch,
} from '@/shared/schema/common';
```

---

## Migration Patterns

### 1. Replace Module-Level `detailedResponse`

**Before (in module schema):**
```typescript
// product.schema.ts - each module defines its own
export const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(["success", "error", "failed"]).default("success"),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z.object({
      timestamp: z.date().default(() => new Date()),
      version: z.string().default("1.0.0"),
      count: z.number().optional(),
    }).optional(),
  });
```

**After (use shared):**
```typescript
// product.schema.ts
import { detailedResponse } from '@/shared/schema/common';

// Same API, now consistent across all modules
export const productContract = {
  get: {
    output: detailedResponse(productSelectSchema.nullable()),
  },
};
```

### 2. Standardize Pagination Input

**Before (various patterns across modules):**
```typescript
// Different in each module
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});
```

**After (shared pattern):**
```typescript
import { offsetPaginationSchema, calculateOffset } from '@/shared/schema/common';

// In API:
getMany: protectedProcedure
  .input(z.object({
    query: offsetPaginationSchema.extend({
      categorySlug: z.string().optional(),
    }),
  }))
  .query(async ({ input }) => {
    const { offset, limit } = input.query;
    // ... use directly with Drizzle
  }),
```

### 3. Use Soft Delete Utilities

**Before (direct Drizzle calls):**
```typescript
import { isNull } from 'drizzle-orm';

.where(and(eq(product.id, id), isNull(product.deletedAt)))
```

**After (shared utilities):**
```typescript
import { softDeleteFilter, withSoftDelete } from '@/shared/schema/common';

// Option 1: Simple filter
.where(and(eq(product.id, id), softDeleteFilter(product.deletedAt)))

// Option 2: Combine multiple conditions
.where(withSoftDelete(
  product.deletedAt,
  eq(product.id, id),
  eq(product.isActive, true)
))
```

### 4. Use Slug Utilities

**Before (inline slug generation):**
```typescript
const slug = title.toLowerCase().replace(/\s+/g, '-');
```

**After (shared utilities):**
```typescript
import { generateSlug, generateDeletedSlug, generateUniqueSlug } from '@/shared/schema/common';

// Generate from title
const slug = generateSlug(productTitle);

// Generate for soft-deleted entity (allows slug reuse)
const deletedSlug = generateDeletedSlug(existingSlug);

// Ensure uniqueness
const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
```

### 5. Use Query Builders

**Before (manual query building):**
```typescript
const products = await db.query.product.findMany({
  limit,
  offset,
  where: (p, { and, eq, isNull }) => {
    const conditions = [isNull(p.deletedAt)];
    if (categorySlug) conditions.push(eq(p.categorySlug, categorySlug));
    return and(...conditions);
  },
  orderBy: (p, { desc }) => [desc(p.createdAt)],
});
```

**After (shared utilities):**
```typescript
import { 
  buildPagination, 
  buildSearch, 
  buildOrderBy, 
  withSoftDelete,
  softDeleteFilter 
} from '@/shared/schema/common';

const { offset, limit } = buildPagination(input);
const searchCondition = buildSearch(input.search, [product.title, product.description]);

const products = await db.query.product.findMany({
  limit,
  offset,
  where: (p, { and, eq }) => {
    const conditions = [
      softDeleteFilter(p.deletedAt),
      ...(categorySlug ? [eq(p.categorySlug, categorySlug)] : []),
    ];
    if (searchCondition) conditions.push(searchCondition);
    return and(...conditions);
  },
  orderBy: buildOrderBy(input.sortBy, input.sortOrder, product, product.createdAt),
});
```

---

## Type Safety Requirements

All module schemas must use Zod for:

1. **Input validation** - `z.object({ params: ..., query: ..., body: ... })`
2. **Output validation** - `detailedResponse(schema)`
3. **Contract definition** - Centralized contract objects

### Example Contract Structure:

```typescript
export const productContract = {
  get: {
    input: z.object({
      params: z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
      }),
    }),
    output: detailedResponse(productSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      query: offsetPaginationSchema.extend({
        categorySlug: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    }),
    output: detailedResponse(z.array(productSelectSchema)),
  },
  create: {
    input: z.object({
      body: productInsertSchema,
    }),
    output: detailedResponse(productSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      body: productUpdateSchema,
    }),
    output: detailedResponse(productSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
    }),
    output: detailedResponse(productSelectSchema.pick({ id: true }).nullable()),
  },
};
```

---

## API Implementation Pattern

```typescript
import { createTRPCRouter, protectedProcedure } from "@/core/api/api.methods";
import { MESSAGE, STATUS } from "@/shared/config/api.config";
import { API_RESPONSE } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { db } from "@/core/db/db";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Import contract and utilities from shared
import { 
  productContract, 
  productInsertSchema,
  detailedResponse 
} from "./product.schema";
import { 
  softDeleteFilter, 
  buildPagination,
  generateSlug 
} from "@/shared/schema/common";
import { product } from "@/core/db/db.schema";

export const productRouter = createTRPCRouter({
  get: protectedProcedure
    .input(productContract.get.input)
    .output(productContract.get.output)
    .query(async ({ input }) => {
      try {
        const { id, slug } = input.params;
        
        if (!id && !slug) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.GET.FAILED, null);
        }

        const [row] = await db
          .select()
          .from(product)
          .where(and(
            id ? eq(product.id, id) : eq(product.slug, slug!),
            softDeleteFilter(product.deletedAt)
          ))
          .limit(1);

        return API_RESPONSE(
          row ? STATUS.SUCCESS : STATUS.FAILED,
          row ? MESSAGE.PRODUCT.GET.SUCCESS : MESSAGE.PRODUCT.GET.FAILED,
          row ?? null,
        );
      } catch (err) {
        debugError("PRODUCT:GET:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET.ERROR, null, err as Error);
      }
    }),

  getMany: protectedProcedure
    .input(productContract.getMany.input)
    .output(productContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const { offset, limit, categorySlug, isActive } = input.query;

        const products = await db.query.product.findMany({
          limit,
          offset,
          where: (p, { and, eq }) => {
            const conditions = [softDeleteFilter(p.deletedAt)];
            if (categorySlug) conditions.push(eq(p.categorySlug, categorySlug));
            if (isActive !== undefined) conditions.push(eq(p.isActive, isActive));
            return and(...conditions);
          },
          orderBy: (p, { desc }) => [desc(p.createdAt)],
        });

        return API_RESPONSE(
          STATUS.SUCCESS, 
          MESSAGE.PRODUCT.GET_MANY.SUCCESS, 
          products,
        );
      } catch (err) {
        debugError("PRODUCT:GET_MANY:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_MANY.ERROR, null, err as Error);
      }
    }),

  create: protectedProcedure
    .input(productContract.create.input)
    .output(productContract.create.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const slug = generateSlug(input.body.title);
        
        const [row] = await db
          .insert(product)
          .values({
            id: uuidv4(),
            ...input.body,
            slug,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return API_RESPONSE(
          STATUS.SUCCESS,
          MESSAGE.PRODUCT.CREATE.SUCCESS,
          row,
        );
      } catch (err) {
        debugError("PRODUCT:CREATE:ERROR", err);
        return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.CREATE.ERROR, null, err as Error);
      }
    }),
});
```

---

## Checklist for Module Updates

When updating existing modules to use shared utilities:

- [ ] Replace local `detailedResponse` with shared import
- [ ] Replace local `paginationSchema` with `offsetPaginationSchema`
- [ ] Replace `isNull(table.deletedAt)` with `softDeleteFilter(table.deletedAt)`
- [ ] Use `generateSlug()` for slug generation
- [ ] Use `buildPagination()` for offset/limit calculation
- [ ] Use `buildSearch()` for search functionality (if applicable)
- [ ] Use `buildOrderBy()` for dynamic sorting (if applicable)
- [ ] Ensure all inputs/outputs use Zod schemas
- [ ] Verify contract input structure: `{ params?, query?, body? }`
- [ ] Test API responses match expected shapes

---

## No-Breaking-Changes Guarantee

All changes are **additive**:

1. Legacy exports in `common.ts` are marked `@deprecated` but still work
2. Existing module schemas continue to function
3. Existing API implementations continue to work
4. New shared utilities are opt-in

---

## Next Steps

1. **Phase 1**: Update existing modules incrementally (product, category, etc.)
2. **Phase 2**: Create missing commerce tables (order, payment, address)
3. **Phase 3**: Implement commerce APIs using shared patterns

---

*Generated for Phase 0 Shared Infrastructure Alignment — **COMPLETED March 3, 2026***
