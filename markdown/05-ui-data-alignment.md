# UI-Data Alignment Plan

## Executive Summary

This document provides a comprehensive audit of all user-facing forms and data tables in the e-commerce application, cross-checking alignment between UI components, Zod validation schemas, API route contracts, and Drizzle database schemas.

**Overall Status**: 🟡 Partially Aligned - Several critical inconsistencies identified

---

## 📚 Document Navigation

| ← Previous | Index | Next → |
|------------|-------|--------|
| [04-form-audit.md](./04-form-audit.md) | [00-index.md](./00-index.md) | [06-full-system-audit.md](./06-full-system-audit.md) |

**Related Documents:**
- Form audit details → [04-form-audit.md](./04-form-audit.md)
- API validation issues → [03-api-analysis.md](./03-api-analysis.md) §3
- UI alignment fixes → [07-completion-roadmap.md](./07-completion-roadmap.md) Phase 4

---

## Module: Auth

### Forms

#### Sign-In Form (`auth.sign-in.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `AuthSchema.SIGN_IN.INPUT` |
| Fields | ✅ Aligned | email, password, rememberMe |
| Validation | ✅ Aligned | Email validation, password min length |
| Defaults | ✅ Aligned | `rememberMe: 'true'` |
| API Contract | ✅ Aligned | Matches `signIn.email()` |

**Issues:**
- ❌ **Type Mismatch**: Schema defines `rememberMe` as `z.string().default('false')` but form sets `'true'` as default
- ❌ **Validation Gap**: No client-side validation feedback for password field requirements

#### Sign-Up Form (`auth.sign-up.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `AuthSchema.SIGN_UP.INPUT` |
| Fields | ✅ Aligned | name, email, password |
| Validation | ✅ Aligned | Strong password rules enforced |
| Defaults | ✅ Aligned | All fields empty string |

**Issues:**
- ❌ **Missing Confirm Password**: Form lacks confirmPassword field though schema supports password matching
- ❌ **No Password Visibility Toggle**: UX issue - no way to see entered password

#### Forgot Password Form (`auth.forgot-password.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `AuthSchema.FORGOT_PASSWORD.INPUT` |
| Fields | ✅ Aligned | email only |
| Validation | ✅ Aligned | Email format validation |

**Status**: ✅ **Fully Aligned**

#### Reset Password Form (`auth.reset-password.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `AuthSchema.CHANGE_PASSWORD.INPUT` |
| Fields | 🟡 Partial | password, confirmPassword, token (token is auto-populated) |
| Validation | 🟡 Partial | Password rules enforced but no real-time validation display |

**Issues:**
- ❌ **Schema Over-Engineering**: Schema includes `oldPassword`, `userId` that form doesn't use
- ❌ **No Password Strength Indicator**: Schema has complex regex rules but UI doesn't show strength

#### Change Password Form (`account.password-change.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ❌ Misaligned | Uses inline `changePasswordSchema` NOT `AuthSchema.CHANGE_PASSWORD.INPUT` |
| Fields | 🟡 Partial | currentPassword, newPassword, revokeOtherSessions |
| Validation | ❌ Misaligned | Different validation rules than schema (min 6 vs min 8) |

**Critical Issues:**
- ❌ **Schema Inconsistency**: Form uses different schema than auth-schema.ts
- ❌ **Validation Mismatch**: Form requires min 6 chars, auth-schema requires min 8 with complexity
- ❌ **Missing Confirm Password**: No password confirmation field

#### Two-Factor Auth Form (`account.two-factor.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses inline `twoFactorAuthSchema` |
| Fields | ✅ Aligned | password field only |
| Validation | ✅ Aligned | Basic required validation |

**Status**: ✅ **Aligned**

---

## Module: Account/Profile

### Profile Update Form (`account.profile.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ❌ Misaligned | Uses inline `profileUpdateSchema` |
| Database Alignment | ❌ Misaligned | No database schema check for email uniqueness |
| Fields | 🟡 Partial | name (required), email (required but no email format validation) |

**Critical Issues:**
- ❌ **No Email Validation**: Schema uses `z.string().min(1)` instead of `z.string().email()`
- ❌ **No Database Alignment Check**: Doesn't validate email uniqueness against DB
- ❌ **Missing Fields**: DB has `image`, `role`, `banned` - form doesn't handle these

**Status**: ❌ **Misaligned**

---

## Module: Category

### Category Create Form (`category.component.form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `categoryContract.create.input` |
| Database Alignment | 🟡 Partial | Missing `icon` in submission mapping |
| Fields | 🟡 Partial | 11 fields mapped |

**Issues:**
- ❌ **Missing Field Submission**: `icon` field in form but not submitted in `onSubmit`
- ❌ **Hardcoded Meta Values**: `metaTitle` and `metaDescription` auto-set from title/description without user input
- ❌ **Default Color Mismatch**: Form default is `'green'`, schema default is `'#FFFFFF'`
- ❌ **No Slug Validation**: No real-time slug uniqueness check

### Category Edit Form (`category.component.edit-form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `categoryContract.update.input` |
| Database Alignment | 🟡 Partial | Same issues as create form |

**Issues:**
- ❌ **Missing ID Validation**: No check if category exists before update
- ❌ **Partial Update Issues**: Form submits all fields even if unchanged

### Category Listing (Table/Data View)
| Aspect | Status | Notes |
|--------|--------|-------|
| Columns | 🟡 Partial | Basic card grid view |
| Sorting | ❌ Missing | No sort functionality |
| Filtering | ❌ Missing | No filter UI |
| Pagination | ❌ Missing | No pagination controls |
| Search | ❌ Missing | No search UI |
| Delete | ✅ Aligned | `CategoryDelete` component exists with confirmation |
| Bulk Actions | ❌ Missing | No bulk operations |

**Status**: 🟡 **Partially Aligned**

---

## Module: Subcategory

### Subcategory Create Form (`subcategory-form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `subcategoryContract.create.input` |
| Database Alignment | ✅ Aligned | All required fields present |
| Fields | 🟡 Partial | 12 fields, but `categorySlug` is from prop not form |

**Issues:**
- ❌ **Default Color Mismatch**: Form default `'#3b82f6'` vs schema `'#FFFFFF'`
- ❌ **Missing Meta Fields**: `metaTitle`, `metaDescription` not in form UI despite schema support
- ❌ **No Icon Selector**: Schema supports `icon` but no UI field
- ❌ **No Slug Uniqueness Check**: No real-time validation

**Status**: 🟡 **Partially Aligned**

---

## Module: Series

### Series Create Form (`series-form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `seriesContract.create.input` |
| Database Alignment | ✅ Aligned | All required fields present |
| Fields | 🟡 Partial | Similar to subcategory |

**Issues:**
- ❌ **Same Issues as Subcategory**: Color default mismatch, missing meta fields, no icon selector
- ❌ **Hardcoded Defaults**: `icon: 'folder'` hardcoded in submit

**Status**: 🟡 **Partially Aligned**

---

## Module: Product

### Product Create Form (`product-form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `productContract.create.input` |
| Database Alignment | 🟡 Partial | Missing `metaTitle`, `metaDescription` in UI |
| Fields | 🟡 Partial | Core fields present |

**Issues:**
- ❌ **Missing SEO Fields**: `metaTitle`, `metaDescription` in schema but not in UI
- ❌ **Series Default Hardcoded**: `seriesSlug: 'phone-cases-series-1'` is hardcoded default
- ❌ **No Category/Subcategory Validation**: No check if slugs exist in DB
- ❌ **Features Array Handling**: Form adds empty feature that gets submitted
- ❌ **No Price Validation**: No min/max price constraints in UI

### Product Edit Form (`product-edit-form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `productContract.update.input` |
| Database Alignment | 🟡 Partial | Same issues as create |

**Issues:**
- ❌ **No Optimistic Updates**: No UI feedback during update
- ❌ **Slug Change Warning**: No warning when changing slug (breaks URLs)

### Product Listing/Table
| Aspect | Status | Notes |
|--------|--------|-------|
| Columns | ❌ Missing | No formal table view identified |
| Sorting | ❌ Missing | Not implemented |
| Filtering | ❌ Missing | Not implemented |
| Pagination | ❌ Missing | Not implemented |
| Search | ✅ Aligned | API has search endpoint |
| Delete | 🟡 Partial | API supports soft delete |
| Bulk Actions | ❌ Missing | Not implemented |

**Status**: 🟡 **Partially Aligned**

---

## Module: Product Variant

### Variant Create Form (`product-variant-add-form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `productVariantContract.create.input` |
| Database Alignment | 🟡 Partial | `priceModifierValue` type mismatch |
| Fields | 🟡 Partial | 6 main sections |

**Critical Issues:**
- ❌ **Type Mismatch - CRITICAL**: Schema defines `priceModifierValue: z.string()` but database expects `numeric` 
- ❌ **Inventory Fields All Required**: Form marks all inventory fields as `required: true` but DB has defaults
- ❌ **Attributes Type Issue**: Form allows empty values but schema requires min length
- ❌ **Media URL Validation**: No URL format validation for media URLs

**Status**: ❌ **Misaligned - Critical Type Issues**

---

## Module: Inventory

### Inventory Edit Form (`inventory.component.edit-form.tsx`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Schema Alignment | ✅ Aligned | Uses `inventoryContract.update.input` |
| Database Alignment | ✅ Aligned | All fields match DB |
| Fields | ✅ Aligned | sku, barcode, quantity, incoming, reserved |

**Issues:**
- ❌ **No Stock Validation**: No check that quantity >= reserved
- ❌ **No Negative Number Prevention**: No min(0) validation in UI
- ❌ **Missing Variant ID Display**: No context of which variant this belongs to

### Inventory Section/Listing
| Aspect | Status | Notes |
|--------|--------|-------|
| Columns | 🟡 Partial | Card-based listing |
| Sorting | ❌ Missing | Not implemented |
| Filtering | ❌ Missing | Not implemented |
| Pagination | ❌ Missing | Not implemented |
| Search | ✅ Aligned | Search implemented in API |
| Update Stock | ✅ Aligned | `updateStock` endpoint exists |
| Bulk Actions | ❌ Missing | Not implemented |

**Status**: 🟡 **Partially Aligned**

---

## Module: Attribute

### Status: ❌ **Missing Form**
- **Issue**: No create/edit form found for attributes
- **Database**: `attribute` table exists with full schema
- **Schema**: `attributeContract` exists with CRUD operations
- **Gap**: No UI for managing attributes

---

## Critical Cross-Cutting Issues

### 1. Enum Inconsistencies

| Enum | Database | Zod Schema | UI Options | Status |
|------|----------|------------|------------|--------|
| DisplayType | ✅ 5 values | ✅ 5 values | ✅ 5 values | ✅ Aligned |
| Visibility | ✅ 3 values | ✅ 3 values | ✅ 3 values | ✅ Aligned |
| ProductStatus | ✅ 3 values | ✅ 3 values | ✅ 3 values | ✅ Aligned |
| PriceModifierType | ❌ N/A - stored as text | ✅ 4 values | ✅ 4 values | 🟡 Partial |

### 2. Soft Delete vs Hard Delete Inconsistencies

| Module | Delete Type | Implementation | Issue |
|--------|-------------|----------------|-------|
| Category | Soft | `deletedAt` timestamp | ✅ Consistent |
| Subcategory | Soft | `deletedAt` timestamp | ✅ Consistent |
| Series | Soft | `deletedAt` timestamp | ✅ Consistent |
| Product | Soft + Slug Rename | `deletedAt` + slug modification | 🟡 Over-engineered |
| ProductVariant | Soft | `deletedAt` timestamp | ✅ Consistent |
| Inventory | **Hard** | `db.delete()` | ❌ **INCONSISTENT** |

**Critical Issue**: Inventory uses hard delete while all other modules use soft delete!

### 3. Default Value Mismatches

| Field | Database Default | Schema Default | Form Default | Status |
|-------|------------------|----------------|--------------|--------|
| category.color | `#FFFFFF` | `#FFFFFF` | `green` | ❌ Misaligned |
| subcategory.color | `#FFFFFF` | `#FFFFFF` | `#3b82f6` | ❌ Misaligned |
| series.color | `#FFFFFF` | `#FFFFFF` | `#3b82f6` | ❌ Misaligned |
| product.baseCurrency | `INR` | `INR` | `INR` | ✅ Aligned |
| inventory.quantity | `0` | N/A | `0` | 🟡 Partial |

### 4. Missing Validation Layers

| Validation Type | UI | Zod Schema | API | Database | Status |
|-----------------|----|------------|-----|----------|--------|
| Email Format | Partial | ✅ | N/A | N/A | 🟡 Partial |
| Password Complexity | Partial | ✅ | ✅ | ✅ | 🟡 Partial |
| Slug Uniqueness | ❌ | ❌ | ✅ | ✅ | ❌ Missing |
| Foreign Key Existence | ❌ | ❌ | ❌ | ✅ | ❌ Missing |
| Price Range | ❌ | ❌ | ❌ | ❌ | ❌ Missing |

---

## Data Integrity Risks

### High Risk
1. **Inventory Hard Delete**: Data loss risk - no recovery mechanism
2. **Price Modifier Type Mismatch**: String in schema vs Numeric in DB
3. **No Foreign Key Validation**: Can create products with non-existent categories
4. **Missing Category Slug Check**: API allows duplicate slug check but UI doesn't

### Medium Risk
1. **Password Validation Inconsistency**: Different rules across forms
2. **Missing Required Field Handling**: `metaTitle`, `metaDescription` not in UI
3. **No Optimistic UI**: Poor UX during mutations
4. **Missing Bulk Operations**: Admin efficiency impact

### Low Risk
1. **Color Default Mismatches**: Visual inconsistency only
2. **Missing Icon Selectors**: Feature gap not data risk

---

## Required Actions for Production Readiness

### Immediate (Critical)

1. **Fix Inventory Delete** (`inventory.api.ts:204`)
   - Change hard delete to soft delete
   - Add `deletedAt` timestamp update

2. **Fix Price Modifier Value Type** (`product-variant.schema.ts:31`)
   - Change from `z.string()` to `z.number()` or `z.coerce.number()`
   - Align with database `numeric` type

3. **Standardize Password Validation**
   - Update `account.password-change.tsx` to use `AuthSchema.CHANGE_PASSWORD.INPUT`
   - Ensure all password fields use consistent 8-char minimum with complexity

4. **Add Slug Uniqueness Check to UI**
   - Add async validation to slug fields
   - Check against existing records before submission

### Short Term (High Priority)

5. **Add Missing SEO Fields**
   - Add `metaTitle`, `metaDescription` fields to Product forms
   - Add to Subcategory and Series forms

6. **Fix Default Value Mismatches**
   - Standardize color defaults to `#FFFFFF` or document intentional overrides

7. **Add Foreign Key Validation**
   - Validate `categorySlug`, `subcategorySlug`, `seriesSlug` exist before product creation
   - Add similar validation for variant creation

8. **Add Inventory Stock Validation**
   - Ensure `quantity >= reserved` in UI and API
   - Add min(0) validation for all numeric fields

### Medium Term

9. **Implement Data Tables**
   - Add proper table views with columns matching schema
   - Implement sorting, filtering, pagination
   - Add bulk action capabilities

10. **Add Confirmation Flows**
    - Confirm before delete operations
    - Warn before slug changes (URL breaks)

11. **Create Attribute Management UI**
    - Build create/edit forms for attributes
    - Link to series management

12. **Add Optimistic UI**
    - Implement loading states and optimistic updates
    - Better error handling and recovery

### Long Term

13. **Schema Documentation**
    - Document all enum values and their meanings
    - Create validation rule documentation

14. **Testing Coverage**
    - Add integration tests for form submissions
    - Test validation rules across all layers

---

## Module Summary Matrix

| Module | Forms Status | Tables Status | API Status | DB Alignment | Overall |
|--------|--------------|---------------|------------|----------------|---------|
| Auth | 🟡 Partial | N/A | ✅ | ✅ | 🟡 |
| Account/Profile | ❌ Misaligned | N/A | ✅ | 🟡 | ❌ |
| Category | 🟡 Partial | ❌ Missing | ✅ | ✅ | 🟡 |
| Subcategory | 🟡 Partial | ❌ Missing | ✅ | ✅ | 🟡 |
| Series | 🟡 Partial | ❌ Missing | ✅ | ✅ | 🟡 |
| Product | 🟡 Partial | ❌ Missing | ✅ | ✅ | 🟡 |
| Product Variant | ❌ Misaligned | ❌ Missing | ✅ | ❌ | ❌ |
| Inventory | 🟡 Partial | 🟡 Partial | ✅ | ✅ | 🟡 |
| Attribute | ❌ Missing | ❌ Missing | ✅ | ✅ | ❌ |

---

## Conclusion

The application has a solid foundation with comprehensive schemas and API contracts, but significant gaps exist in:

1. **UI-Schema Alignment**: Multiple forms use inline schemas instead of shared contracts
2. **Data Type Consistency**: Critical type mismatch in product variant pricing
3. **Soft Delete Strategy**: Inventory module doesn't follow soft-delete pattern
4. **Data Table Implementation**: No proper table views with full CRUD operations
5. **Validation Completeness**: Missing foreign key validation and slug uniqueness checks

**Estimated Effort for Full Alignment**: 2-3 sprints
- Sprint 1: Critical fixes (inventory delete, price type, password validation)
- Sprint 2: Form alignment and missing fields
- Sprint 3: Data tables and bulk operations

**Risk Level**: Medium-High - Data integrity issues could cause production problems
