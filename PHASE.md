# E-Commerce Platform — Phase Execution Plan

> **Updated:** 2026-03-06
> **Platform:** Single-Merchant Enterprise Commerce
> **Stack:** Next.js 16 · tRPC v11 · Drizzle ORM · Neon Postgres · Better Auth · shadcn/ui · Tailwind CSS v4
> **Overall Completion:** ~72% (MVP), ~45% (All Phases)

---

## How to Read This Document

- Each **phase** focuses on **one primary module** (or a tightly related pair)
- Phases are ordered by **dependency** — earlier phases must be done before later ones
- Phases 1–23 cover **MVP** scope; Phases 24–26 are **Post-MVP**; Phases 27–31 are **Enterprise**
- Tasks include core development, bug fixes, UI consistency, UX refinements, and system polish
- All icons use **lucide-react** exclusively
- The **Progress Table** at the bottom tracks every module and phase at a glance

### Legend

| Icon | Meaning                                                    |
| ---- | ---------------------------------------------------------- |
| ✅    | Complete — fully implemented and functional                |
| 🟡   | Partial — scaffolded or partially working, needs more work |
| ❌    | Not Started — route/schema may exist but no real logic     |

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

| #  | Status | Task                                                                                   |
| -- | ------ | -------------------------------------------------------------------------------------- |
| 1  | ✅      | Next.js 16 with TypeScript, React 19, React Compiler                                  |
| 2  | ✅      | Tailwind CSS v4 + PostCSS configuration with `@theme inline` design tokens             |
| 3  | ✅      | Biome linter/formatter + Husky pre-commit hooks                                        |
| 4  | ✅      | Path aliases (`@/`) via `tsconfig.json`                                                |
| 5  | ✅      | Environment variable validation (`@t3-oss/env-nextjs`) — server and client configs     |
| 6  | ✅      | Neon Postgres connection via `@neondatabase/serverless`                                 |
| 7  | ✅      | Drizzle ORM with full schema (`db.schema.ts` — 47+ tables, 15+ enums)                 |
| 8  | ✅      | Drizzle Kit scripts (generate, migrate, push, studio, drop, reset)                     |
| 9  | ✅      | SQL migration files tracked in `migrations/`                                           |
| 10 | ✅      | Relational mapping for all entity relationships via `relations()`                      |
| 11 | ✅      | DB indexes on frequently queried columns                                               |
| 12 | ✅      | tRPC v11 initialization with SuperJSON transformer                                     |
| 13 | ✅      | Context factory with session/user injection from `getServerSession()`                  |
| 14 | ✅      | `publicProcedure`, `protectedProcedure`, `adminProcedure`, `customerProcedure`, `staffProcedure` |
| 15 | ✅      | Standardized `API_RESPONSE` wrapper + `STATUS`/`MESSAGE` constants                    |
| 16 | ✅      | Server-side caller factory (`apiServer`) for RSC data fetching                         |
| 17 | ✅      | React Query + tRPC client integration with `HydrateClient`                             |
| 18 | ✅      | Resend email client integration (`src/core/mail/`)                                     |
| 19 | ✅      | React Email templates (welcome, verification, password reset, delete account)          |
| 20 | ✅      | Shared schema layer (`pagination`, `api`, `common`, `enums`)                           |
| 21 | ✅      | Shared utilities (`slug.utils`, `soft-delete.utils`, `query.utils`, `logger.utils`)    |
| 22 | 🟡     | Fix `Boolean(process.env.SKIP_ENV_VALIDATION)` coercion — string `"false"` is truthy  |
| 23 | 🟡     | Fix `ARKJET_API_KEY` typo → `ARCJET_API_KEY` in env server config                     |
| 24 | ❌      | Create `.env.example` with all required variables documented (no real secrets)          |
| 25 | ❌      | Activate Arcjet rate-limiting middleware on `/api/v1` route handler                    |
| 26 | ❌      | Add health-check API endpoint (`/api/health`) for uptime monitoring                   |
| 27 | ❌      | Add `middleware.ts` for centralized route protection and redirects                     |

---

### Phase 2: Authentication & Authorization

**Module:** Auth (`src/core/auth/`, `src/module/auth/`)
**Status:** ✅ Complete
**Dependencies:** Phase 1

| #  | Status | Task                                                                                            |
| -- | ------ | ----------------------------------------------------------------------------------------------- |
| 1  | ✅      | Better Auth with email/password (verification required)                                        |
| 2  | ✅      | GitHub OAuth social login                                                                      |
| 3  | ✅      | Two-factor authentication (TOTP)                                                               |
| 4  | ✅      | Passkey / WebAuthn support                                                                     |
| 5  | ✅      | Admin plugin with role-based access (`admin`, `user`, `staff`, `customer`)                     |
| 6  | ✅      | Session management with cookie caching                                                         |
| 7  | ✅      | Rate limiting (database-backed) on auth endpoints                                              |
| 8  | ✅      | Server-side session helpers (`getServerSession`)                                               |
| 9  | ✅      | Client-side auth hooks (`auth.client.ts`)                                                      |
| 10 | ✅      | Permission definitions (`permissions.ts`) and auth guard (`auth.guard.ts`)                     |
| 11 | ✅      | Sign In / Sign Up / Forgot Password / Reset Password forms                                    |
| 12 | ✅      | Email Verification flow                                                                        |
| 13 | ✅      | GitHub OAuth + Passkey buttons                                                                 |
| 14 | ✅      | Sign-out (button, dropdown, icon variants)                                                     |
| 15 | ✅      | `customerProcedure` enforced on customer-facing mutations                                      |
| 16 | ✅      | Permission check helper (`getServerUserPermission()`)                                          |
| 17 | ✅      | Blob upload API requires authenticated session                                                 |
| 18 | 🟡     | Add rate limiting to `/api/blob/upload` endpoint                                               |
| 19 | 🟡     | Audit all routers: ensure storefront read routes use `publicProcedure` (not `staffProcedure`)  |
| 20 | 🟡     | Add `publicProcedure` variant for `series.getMany` — currently blocks unauthenticated browsing |
| 21 | ❌      | Add CSRF token protection to all auth forms                                                    |
| 22 | ❌      | Add session expiry warning toast when session nears timeout                                    |
| 23 | ❌      | Add "Remember me" checkbox on sign-in form                                                     |
| 24 | ❌      | Add password strength indicator on sign-up and password change forms                           |
| 25 | ❌      | Add account lock after N failed login attempts with unlock email                               |
| 26 | ❌      | Secure `/api/blob/upload`: add server-side file validation (10 MB max, MIME allowlist: jpeg/png/webp/gif/svg+xml) |
| 27 | ❌      | Secure `/api/blob/upload`: scope blob keys to `images/{userId}/{uuid}-{sanitizedFilename}` to prevent collisions |
| 28 | ❌      | Secure `/api/blob/upload`: reject unauthenticated requests with 401 and enforce 10 uploads/min/user rate limit   |

---

### Phase 3: Shared UI & Design System

**Module:** Shared (`src/shared/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 1

| #  | Status | Task                                                                                                       |
| -- | ------ | ---------------------------------------------------------------------------------------------------------- |
| 1  | ✅      | 56 Radix-based shadcn/ui components installed (accordion, dialog, dropdown, tabs, tooltip, etc.)            |
| 2  | ✅      | Custom components: `BlurImage`, `CardSwap`, `Empty`, `Spinner`, `KBD`                                     |
| 3  | ✅      | Generic `Form` component with Zod schema validation (`react-hook-form` + `zodResolver`)                   |
| 4  | ✅      | 16 field types: text, password, email, number, select, multi-select, checkbox, radio, switch, textarea, color, currency, OTP, image upload, slug, array |
| 5  | ✅      | Shell component with section variants (`default`, `dashboard`, `full`, `flexed`, `center`)                 |
| 6  | ✅      | Shell sub-components: `Shell.Header`, `Shell.Main`, `Shell.Aside`, `Shell.Footer`, `Shell.Section`         |
| 7  | ✅      | Header with fixed positioning, backdrop blur, and z-50 stacking                                            |
| 8  | ✅      | Footer, Breadcrumbs, Sidebar, Nav-user layout components                                                   |
| 9  | ✅      | Section component (Card-based with title, description, action link)                                        |
| 10 | ✅      | SectionHeader with GoBackButton and breadcrumb navigation                                                  |
| 11 | ✅      | SectionDashboard with title, description, and action button                                                |
| 12 | ✅      | `cn()` Tailwind merge utility                                                                              |
| 13 | ✅      | Logger, date/time, URL, data masking utilities                                                             |
| 14 | ✅      | `useMobile`, `useFileUpload` hooks                                                                         |
| 15 | ✅      | Image upload field: RAF cancelled on unmount; refs used to avoid stale closures                            |
| 16 | ✅      | Currency field stores string; schemas use `z.coerce.number()` where needed                                 |
| 17 | ✅      | Basic `Table` primitives (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`)       |
| 18 | ✅      | Sonner toast system with `position="top-center"`, `richColors`, lucide-react icons                         |
| 19 | ❌      | Build reusable `DataTable` component using `@tanstack/react-table` with typed column definitions           |
| 20 | ❌      | Add DataTable sortable column headers with ascending/descending/none indicators (lucide-react ArrowUpDown) |
| 21 | ❌      | Add DataTable column-level text and select filters                                                         |
| 22 | ❌      | Add DataTable pagination (page size selector, page navigation, total count display)                        |
| 23 | ❌      | Add DataTable row selection with checkbox column and bulk action toolbar                                   |
| 24 | ❌      | Add DataTable column visibility toggle dropdown (lucide-react SlidersHorizontal)                           |
| 25 | ❌      | Add DataTable loading state with skeleton rows matching column layout                                      |
| 26 | ❌      | Add DataTable empty state integrating the `Empty` component                                                |
| 27 | ❌      | Create reusable `PageHeader` component (title, description, breadcrumbs, action buttons)                   |
| 28 | ❌      | Create reusable `DashboardShell` wrapper composing Shell + PageHeader + content area                       |
| 29 | ❌      | Create reusable `ConfirmDialog` component (title, description, confirm/cancel, destructive variant)        |
| 30 | ❌      | Migrate toast patterns to `toast.promise(asyncFn, { loading, success, error })` across all mutations       |
| 31 | ❌      | Create reusable `StatusBadge` component for consistent status display (order, payment, shipment statuses)  |
| 32 | ❌      | Create reusable `PriceBadge` component for consistent currency formatting (₹, $, locale-aware)            |
| 33 | ❌      | Create reusable `InfoTooltip` component (lucide-react Info icon + Tooltip with description)                |
| 34 | ❌      | Create reusable `FormCard` wrapper (Card + CardHeader + CardContent for consistent form page layouts)      |
| 35 | ❌      | Create reusable `SectionGrid` component for consistent responsive card-grid layouts                       |
| 36 | ❌      | Create reusable `StatsCard` component for dashboard KPI display (icon, title, value, trend)               |
| 37 | ❌      | Standardize typography hierarchy: `h1` (page title), `h2` (section), `h3` (card), `h4` (subsection)      |
| 38 | ❌      | Standardize spacing tokens: `gap-4` (tight), `gap-6` (default), `gap-8` (loose) across all layouts       |
| 39 | ❌      | Unify Card styling: consistent border-radius, shadow, and padding across all card instances                |
| 40 | ❌      | Standardize icon sizing: `size-4` (inline), `size-5` (action buttons), `size-6` (hero) with lucide-react |
| 41 | ❌      | Add consistent disabled state styling across all interactive components                                    |
| 42 | ❌      | Add focus-visible ring styles to all focusable elements for keyboard navigation                            |
| 43 | ❌      | Add Skeleton variants for common layouts (card-grid, list-row, detail-page, form)                         |
| 44 | ❌      | Standardize all button groups with consistent spacing and alignment patterns                               |
| 45 | ❌      | Add `EmptyState` presets for common scenarios (no items, no results, error state)                          |
| 46 | 🟡     | Fix image upload fake progress — `tick()` captures stale `isUploading`, RAF loop runs once and stops (`field.image-upload.tsx`) |
| 47 | 🟡     | Fix image preview not updating when replacing — `src` prioritizes old URL over new file preview; must remove before re-upload  |
| 48 | 🟡     | Fix "forgot to upload" trap — selecting a file does NOT set form value; form can submit with empty URL despite visual preview  |
| 49 | 🟡     | Fix `uploadFirst` stale closure in `use-file-upload.ts` — may reference stale `state.files` snapshot                          |
| 50 | 🟡     | Remove unused `previewUrlFromForm` variable in `field.image-upload.tsx`                                                       |
| 51 | ❌      | Refactor image upload to auto-upload on file selection (remove separate "Upload" button, show progress indicator)              |
| 52 | ❌      | Add orphaned blob cleanup — "Remove" should call `del(url)` from `@vercel/blob` to delete the blob, not just clear form value |
| 53 | ❌      | Create shared `imageUrlSchema` (`z.string().url().nullable().optional()`) in `src/shared/schema/image.schema.ts`              |
| 54 | ❌      | Create shared `mediaItemSchema` (`{ url: z.string().url(), alt: z.string().optional() }`) for variant media arrays            |
| 55 | ❌      | Standardize all image URL validation: category/subcategory/series/product schemas should use `imageUrlSchema`                  |
| 56 | ❌      | Remove unused `imageTypeEnum` from `enums.schema.ts` or activate it in the media module                                       |
| 57 | ❌      | Build `type: "imageMulti"` form field — multi-image upload with thumbnail grid, drag-to-reorder, add/remove, auto-upload      |
| 58 | ❌      | Build `type: "avatar"` form field — circular crop preview, camera overlay on hover, auto-upload, sizes sm/md/lg               |
| 59 | ❌      | Build `type: "coverImage"` form field — wide aspect-ratio (16/5) preview, overlay edit button, auto-upload                    |
| 60 | ❌      | Register `imageMulti`, `avatar`, `coverImage` in `fields.config.tsx` with lazy loading and skeleton fallbacks                  |
| 61 | ❌      | Activate `media` table — create `src/module/media/media.api.ts` tRPC router: `upload`, `list`, `delete`, `update`, `getById`  |
| 62 | ❌      | Redirect upload flow through media router: Field → hook → `tRPC media.upload` → blob + media row → `{ id, url }` → form value|
| 63 | ❌      | Add deletion flow through media router: `field.onChange("")` + `tRPC media.delete(id)` → blob deleted + row removed            |
| 64 | ❌      | Build Image Picker / Gallery Dialog (`image-picker-dialog.tsx`) — browse previously uploaded images from `media` table          |
| 65 | ❌      | Add "Browse Library" button to all image field components that opens the Image Picker Dialog                                   |
| 66 | ❌      | Add image picker grid with search, type filter, pagination, and click-to-select                                                |

---

### Phase 4: Category Management

**Module:** Category (`src/module/category/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 1, Phase 3

| #  | Status | Task                                                                                                   |
| -- | ------ | ------------------------------------------------------------------------------------------------------ |
| 1  | ✅      | DB schema: `category` table with visibility, featured, display type, soft-delete                       |
| 2  | ✅      | tRPC API: full CRUD + `getMany`, `getAllFeatured`, `getManyWithSubcategories`, `getManyByTypes`         |
| 3  | ✅      | Zod contract validation (`category.schema.ts`)                                                         |
| 4  | ✅      | Studio admin: list, create, edit, delete pages                                                         |
| 5  | ✅      | Store: category listing page (`/store/categories`)                                                     |
| 6  | ✅      | UI components: card, form, edit-form, delete dialog, listing, preview, section, skeleton, banner, shop-by |
| 7  | ✅      | Homepage: featured categories section + shop-by-category grid                                          |
| 8  | 🟡     | Fix slug update logic: check uniqueness against other records (exclude current ID with `ne`)            |
| 9  | ✅      | Add soft-delete filter (`isNull(deletedAt)`) to `get` query                                            |
| 10 | ✅      | Add soft-delete filter (`isNull(deletedAt)`) to `getMany` query                                        |
| 11 | ✅      | Add soft-delete filter to `getAllFeatured` and `getManyWithSubcategories`                               |
| 12 | 🟡     | Add cascading soft-delete: category deletion cascades to child subcategories                            |
| 13 | ❌      | Add search input with debounce to Studio category listing                                              |
| 14 | ❌      | Add visibility badge (lucide-react Eye/EyeOff) to category cards in Studio                             |
| 15 | ❌      | Add featured badge indicator (lucide-react Star) to category cards                                     |
| 16 | ❌      | Add category count indicator in section header                                                         |
| 17 | ✅      | Replace Studio category listing with DataTable (sorting, filtering, pagination)                        |
| 18 | ✅      | Add bulk actions toolbar for categories (bulk delete, bulk visibility toggle)                           |
| 19 | ❌      | Add tooltip on delete button: "Delete category" (lucide-react Trash2)                                  |
| 20 | ❌      | Add cascade warning in delete confirmation when category has subcategories                              |
| 21 | ❌      | Add inline visibility toggle (Switch) in category table row                                            |
| 22 | ❌      | Add category image preview thumbnail in Studio listing                                                 |
| 23 | ❌      | Add "View in Store" link (lucide-react ExternalLink) on Studio category detail page                    |
| 24 | ❌      | Add hover card preview for category in Studio listings                                                 |
| 25 | ❌      | Wrap category form in `FormCard` component for consistent layout                                       |
| 26 | ❌      | Add proper form validation error messages for all category fields                                      |
| 27 | ❌      | Migrate category CRUD toasts to `toast.promise()` pattern                                              |
| 28 | ✅      | Add loading skeleton for Studio category list page (`loading.tsx`)                                     |
| 29 | ✅      | Add empty state with illustration and "Add first category" CTA                                         |
| 30 | ❌      | Add breadcrumb trail on category detail page in Studio                                                 |
| 31 | ❌      | Add `icon` upload field to category form — DB column exists but has no form UI                          |
| 32 | ❌      | Add `type: "coverImage"` field for category hero/banner image (wide aspect-ratio preview)              |

---

### Phase 5: Subcategory Management

**Module:** Subcategory (`src/module/subcategory/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 4 (Category)

| #  | Status | Task                                                                                              |
| -- | ------ | ------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `subcategory` table linked to `category`                                               |
| 2  | ✅      | tRPC API: full CRUD + `getBySlug`, `getManyByCategorySlug`                                        |
| 3  | ✅      | Studio admin: list, create, edit pages nested under category                                      |
| 4  | ✅      | Store: subcategory listing under category (`/store/[categorySlug]`)                               |
| 5  | ✅      | UI components: form, edit-form, card, listing, skeleton                                           |
| 6  | 🟡     | Add duplicate slug check on create (unique per parent category)                                    |
| 7  | 🟡     | Add soft-delete filter (`isNull(deletedAt)`) to all read queries                                   |
| 8  | 🟡     | Add cascading soft-delete: subcategory deletion cascades to child series                           |
| 9  | ❌      | Add search input with debounce to Studio subcategory listing                                       |
| 10 | ❌      | Add subcategory count indicator in section header                                                  |
| 11 | ❌      | Replace Studio subcategory listing with DataTable (sorting, filtering, pagination)                 |
| 12 | ❌      | Add visibility badge (lucide-react Eye/EyeOff) to subcategory cards                               |
| 13 | ❌      | Add tooltip on delete button: "Delete subcategory" (lucide-react Trash2)                           |
| 14 | ❌      | Add cascade warning in delete confirmation when subcategory has series                             |
| 15 | ❌      | Add inline visibility toggle (Switch) in subcategory table row                                     |
| 16 | ❌      | Add subcategory image preview thumbnail in Studio                                                  |
| 17 | ❌      | Add breadcrumb trail: Categories → [Category] → Subcategories                                     |
| 18 | ❌      | Add "View in Store" link (lucide-react ExternalLink) on detail page                               |
| 19 | ❌      | Wrap subcategory form in `FormCard` component                                                      |
| 20 | ❌      | Add proper form validation error messages for all subcategory fields                               |
| 21 | ❌      | Migrate subcategory CRUD toasts to `toast.promise()` pattern                                       |
| 22 | ❌      | Add loading skeleton for Studio subcategory list page                                              |
| 23 | ❌      | Add empty state with "Add first subcategory" CTA                                                   |
| 24 | ❌      | Add parent category name display in subcategory listing                                            |
| 25 | ❌      | Add series count badge next to each subcategory in Studio                                          |
| 26 | ❌      | Add `icon` upload field to subcategory form — DB column exists but has no form UI                   |

---

### Phase 6: Series Management

**Module:** Series (`src/module/series/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 5 (Subcategory)

| #  | Status | Task                                                                                         |
| -- | ------ | -------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `series` table linked to `subcategory`                                            |
| 2  | ✅      | tRPC API: full CRUD + listing                                                                |
| 3  | ✅      | Studio admin: series page nested under subcategory                                           |
| 4  | ✅      | Store: series page (`/store/[cat]/[subcat]/[seriesSlug]`)                                    |
| 5  | ✅      | UI components: form, listing, card                                                           |
| 6  | 🟡     | Add `publicProcedure` variant for `getMany` (storefront browsing — currently `staffProcedure`) |
| 7  | 🟡     | Add soft-delete filter (`isNull(deletedAt)`) to all read queries                              |
| 8  | 🟡     | Add cascading soft-delete: series deletion cascades to child products                         |
| 9  | ❌      | Add search input with debounce to Studio series listing                                       |
| 10 | ❌      | Add series count indicator in section header                                                  |
| 11 | ❌      | Replace Studio series listing with DataTable (sorting, filtering, pagination)                 |
| 12 | ❌      | Add tooltip on delete button: "Delete series" (lucide-react Trash2)                           |
| 13 | ❌      | Add cascade warning in delete confirmation when series has products                           |
| 14 | ❌      | Add breadcrumb trail: Categories → [Category] → [Subcategory] → Series                       |
| 15 | ❌      | Add "View in Store" link (lucide-react ExternalLink) on detail page                          |
| 16 | ❌      | Wrap series form in `FormCard` component                                                      |
| 17 | ❌      | Add proper form validation error messages for all series fields                               |
| 18 | ❌      | Migrate series CRUD toasts to `toast.promise()` pattern                                       |
| 19 | ❌      | Add loading skeleton for Studio series list page                                              |
| 20 | ❌      | Add empty state with "Add first series" CTA                                                   |
| 21 | ❌      | Add product count badge next to each series in Studio                                         |
| 22 | ❌      | Add series image preview thumbnail in Studio listing                                          |
| 23 | ❌      | Add `icon` upload field to series form — DB column exists but has no form UI                   |

---

### Phase 7: Attribute Management

**Module:** Attribute (`src/module/attribute/`)
**Status:** ✅ Complete
**Dependencies:** Phase 6 (Series)

| #  | Status | Task                                                                                      |
| -- | ------ | ----------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `attribute` table linked to `series`                                           |
| 2  | ✅      | Zod contract validation (`attribute.schema.ts`)                                           |
| 3  | ✅      | tRPC API: `get`, `getBySlug`, `getMany`, `getBySeries`, `create`, `update`, `delete`, `search` |
| 4  | ✅      | Studio admin UI for standalone attribute management (`/studio/products/attributes`)       |
| 5  | ✅      | Attribute form components (create + edit + delete)                                        |
| 6  | ✅      | DB index on `seriesSlug` (`attribute_series_slug_idx`)                                    |
| 7  | ❌      | Add attribute type indicator badge (text, number, select, etc.) in listing                |
| 8  | ❌      | Add attribute count indicator in section header                                           |
| 9  | ❌      | Replace Studio attribute listing with DataTable (sorting, filtering by series, pagination) |
| 10 | ❌      | Add tooltip on delete button: "Delete attribute" (lucide-react Trash2)                    |
| 11 | ❌      | Add confirmation dialog when deleting attribute used by product variants                  |
| 12 | ❌      | Add breadcrumb trail: Products → Attributes → [Attribute]                                 |
| 13 | ❌      | Wrap attribute form in `FormCard` component                                               |
| 14 | ❌      | Add proper form validation error messages for all attribute fields                        |
| 15 | ❌      | Migrate attribute CRUD toasts to `toast.promise()` pattern                                |
| 16 | ❌      | Add loading skeleton for attribute list page                                              |
| 17 | ❌      | Add empty state with "Add first attribute" CTA                                            |
| 18 | ❌      | Add series name display alongside attribute in listing                                    |
| 19 | ❌      | Add "Used by N variants" count badge (lucide-react Layers) on attribute cards             |
| 20 | ❌      | Add search/filter by series name in attribute listing                                     |

---

### Phase 8: Product Management

**Module:** Product (`src/module/product/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 4 (Category), Phase 5 (Subcategory), Phase 6 (Series)

| #  | Status | Task                                                                                                    |
| -- | ------ | ------------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `product` table with category/subcategory/series references, status, pricing                 |
| 2  | ✅      | tRPC API: full CRUD + `getBySlug`, `getProductsBySeriesSlug`, `getPDPProductByVariant`, `search`        |
| 3  | ✅      | Studio admin: list, create, edit product pages                                                          |
| 4  | ✅      | Store: PDP page (`/store/[cat]/[subcat]/[series]/[variant]`)                                            |
| 5  | ✅      | UI components: form, card, listing, view, PDP layout, skeleton                                          |
| 6  | 🟡     | Add SEO fields (`metaTitle`, `metaDescription`) to product create/edit form UI                           |
| 7  | 🟡     | Remove hardcoded `seriesSlug` default from product create form                                           |
| 8  | 🟡     | Add `publicProcedure` variant for product reads used on storefront (currently `staffProcedure` on `get`) |
| 9  | ❌      | Add product listing pagination (offset-based with page size selector) on store pages                    |
| 10 | ❌      | Add product filtering by price range (min/max price slider)                                             |
| 11 | ❌      | Add product filtering by attributes (dynamic filters from series attributes)                            |
| 12 | ❌      | Add product sorting (price asc/desc, date added, name A-Z/Z-A)                                         |
| 13 | ❌      | Build filter sidebar component for store product listing pages                                          |
| 14 | ❌      | Sync filter/sort state to URL query params for shareable filtered views                                 |
| 15 | ❌      | Add product status filter in Studio (draft, active, archived)                                           |
| 16 | ❌      | Add search input with debounce to Studio product listing                                                |
| 17 | ❌      | Add product count indicator in section header                                                           |
| 18 | ❌      | Replace Studio product listing with DataTable (sorting, filtering, pagination)                          |
| 19 | ❌      | Add bulk actions toolbar (bulk status change, bulk delete) in Studio                                    |
| 20 | ❌      | Add product status badge (draft/active/archived) on product cards (lucide-react Circle variants)        |
| 21 | ❌      | Add product price display on Studio listing cards                                                       |
| 22 | ❌      | Add variant count badge (lucide-react Layers) on product cards in Studio                                |
| 23 | ❌      | Add tooltip on delete button: "Delete product" (lucide-react Trash2)                                    |
| 24 | ❌      | Add cascade warning in delete confirmation when product has variants                                    |
| 25 | ❌      | Add breadcrumb trail: Products → [Product] → Edit                                                       |
| 26 | ❌      | Add "View in Store" link (lucide-react ExternalLink) on Studio product detail                           |
| 27 | ❌      | Wrap product form in `FormCard` component                                                               |
| 28 | ❌      | Add proper form validation error messages for all product fields                                        |
| 29 | ❌      | Migrate product CRUD toasts to `toast.promise()` pattern                                                |
| 30 | ❌      | Add loading skeleton for Studio product list page (`loading.tsx`)                                       |
| 31 | ❌      | Add empty state with "Add first product" CTA                                                            |
| 32 | ❌      | Add product image gallery with thumbnail navigation on PDP                                              |
| 33 | ❌      | Add product image zoom on hover/click on PDP                                                            |
| 34 | ❌      | Add "Share product" button (lucide-react Share2) with copy-to-clipboard on PDP                          |
| 35 | ❌      | Add structured product specifications table on PDP                                                      |
| 36 | ❌      | Add "In stock" / "Out of stock" badge (lucide-react Package) on product cards                           |
| 37 | ❌      | Add responsive product grid: 1 col mobile, 2 col tablet, 3–4 col desktop                               |
| 38 | ❌      | Add product card hover effect with subtle scale animation                                               |
| 39 | ❌      | Add recently viewed products section on PDP (client-side localStorage)                                  |
| 40 | ❌      | Add quick-view dialog for product preview from listing pages (lucide-react Eye)                         |
| 41 | ❌      | Add keyboard navigation (arrow keys) for product image gallery on PDP                                   |
| 42 | ❌      | Add product variant selector on PDP with visual swatches (color dots, size chips)                       |
| 43 | ❌      | Replace single `baseImage` with `type: "imageMulti"` for multi-image product gallery                   |
| 44 | ❌      | Use `imageUrlSchema` for `baseImage` validation (standardize with shared image schema)                  |

---

### Phase 9: Product Variant Management

**Module:** Product Variant (`src/module/product-variant/`)
**Status:** ✅ Complete
**Dependencies:** Phase 8 (Product)

| #  | Status | Task                                                                                               |
| -- | ------ | -------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `product_variant` with price modifiers, attributes (JSON), media (JSON)                 |
| 2  | ✅      | tRPC API: full CRUD + `getBySlug` (atomic creation with inventory via transaction)                 |
| 3  | ✅      | Studio admin: create variant page nested under product                                             |
| 4  | ✅      | UI components: form, listing                                                                       |
| 5  | ✅      | `priceModifierValue` contract accepts numeric input (coerces to string)                            |
| 6  | ✅      | Media array default value fixed (`add()` now uses `{ url: '' }`)                                   |
| 7  | ✅      | Dynamic attributes integrated from Attribute module (series-scoped fields in variant create/edit)  |
| 8  | ✅      | Studio admin: variant detail + edit pages (manage media/pricing/attributes; inventory linked)      |
| 9  | ❌      | Add variant count indicator in product detail header                                               |
| 10 | ❌      | Replace variant listing with DataTable in Studio (sorting, filtering, pagination)                  |
| 11 | ❌      | Add variant status badge (active/inactive) on variant cards                                        |
| 12 | ❌      | Add variant price display (base price + modifier) in Studio listing                                |
| 13 | ❌      | Add tooltip on delete button: "Delete variant" (lucide-react Trash2)                               |
| 14 | ❌      | Add confirmation dialog when deleting variant with active inventory                                |
| 15 | ❌      | Add breadcrumb trail: Products → [Product] → Variants → [Variant]                                  |
| 16 | ❌      | Wrap variant form in `FormCard` component                                                          |
| 17 | ❌      | Add proper form validation error messages for all variant fields                                   |
| 18 | ❌      | Migrate variant CRUD toasts to `toast.promise()` pattern                                           |
| 19 | ❌      | Add loading skeleton for variant detail page                                                       |
| 20 | ❌      | Add empty state with "Add first variant" CTA                                                       |
| 21 | ❌      | Add variant image thumbnail preview in Studio listing                                              |
| 22 | ❌      | Add variant media gallery management (reorder via drag, remove, add)                               |
| 23 | ❌      | Add variant attribute display as tags/badges in listing                                            |
| 24 | ❌      | Add "Duplicate variant" action (lucide-react Copy) for quick variant creation                      |
| 25 | ❌      | Add variant inventory status indicator (lucide-react Package — in stock/low/out)                   |
| 26 | ❌      | Add variant price breakdown display (base price ± modifier = final price)                          |
| 27 | 🟡     | Fix variant media schema: default `{ url: "" }` conflicts with `z.string().url()` — starts in invalid state |
| 28 | ❌      | Replace variant media FormGroup + individual image fields with `type: "imageMulti"` field                    |
| 29 | ❌      | Add `alt` text field per variant media item using `mediaItemSchema` for accessibility/SEO                    |
| 30 | ❌      | Use `mediaItemSchema` (`{ url, alt }`) for variant media validation (standardize with shared image schema)   |

---

### Phase 10: Inventory Management

**Module:** Inventory (`src/module/inventory/`)
**Status:** ✅ Complete
**Dependencies:** Phase 9 (Product Variant)

| #  | Status | Task                                                                                              |
| -- | ------ | ------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `inventory_item` + `inventory_reservation` tables                                      |
| 2  | ✅      | tRPC API: full CRUD + `getByVariantId`, `getBySku`, `updateStock`, `search`                       |
| 3  | ✅      | Studio admin: inventory list, detail, edit pages                                                  |
| 4  | ✅      | UI components: card, form, listing                                                                |
| 5  | ✅      | Uses soft delete (consistent with other modules)                                                  |
| 6  | ✅      | Non-negative validation on `quantity`, `incoming`, `reserved`                                     |
| 7  | ✅      | Business rule enforced: `reserved <= quantity`                                                    |
| 8  | ✅      | Edit form null safety improved (typed defaults)                                                   |
| 9  | ✅      | Reservation logic connected to cart (add/update/remove/clear) and order placement                 |
| 10 | ✅      | Low-stock alerts wired (admin email when inventory drops below threshold after order)             |
| 11 | 🟡     | Add missing DB index on `inventory_item.variantId`                                                |
| 12 | 🟡     | Add DB index on `cart.userId` for query performance                                               |
| 13 | 🟡     | Add DB index on `wishlist.userId` for query performance                                           |
| 14 | ❌      | Add search input with SKU/product name search to inventory listing                                |
| 15 | ❌      | Add inventory count indicator in section header                                                   |
| 16 | ❌      | Replace inventory listing with DataTable in Studio (sorting, filtering, pagination)               |
| 17 | ❌      | Add low-stock filter toggle (lucide-react AlertTriangle — show only items below threshold)        |
| 18 | ❌      | Add stock level color coding: green (healthy), yellow (low), red (critical/out)                   |
| 19 | ❌      | Add tooltip on edit/delete buttons (lucide-react Pencil/Trash2)                                   |
| 20 | ❌      | Add breadcrumb trail: Products → Inventory → [SKU]                                                |
| 21 | ❌      | Wrap inventory form in `FormCard` component                                                       |
| 22 | ❌      | Migrate inventory CRUD toasts to `toast.promise()` pattern                                        |
| 23 | ❌      | Add loading skeleton for inventory list and detail pages                                          |
| 24 | ❌      | Add empty state for zero inventory items                                                          |
| 25 | ❌      | Add inventory dashboard summary cards (total items, low stock count, out of stock count)          |
| 26 | ❌      | Add inventory reservation display (show active reservations per item)                             |
| 27 | ❌      | Add bulk stock update functionality (batch quantity adjustment form)                              |
| 28 | ❌      | Add stock adjustment history log display (changes over time)                                      |

---

### Phase 11: Account Management

**Module:** Account (`src/module/account/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 2 (Auth)

| #  | Status | Task                                                                                            |
| -- | ------ | ----------------------------------------------------------------------------------------------- |
| 1  | ✅      | Account root page with session guard                                                            |
| 2  | ✅      | User profile editing                                                                            |
| 3  | ✅      | Password change form                                                                            |
| 4  | ✅      | Set password (for OAuth users)                                                                  |
| 5  | ✅      | Two-factor toggle                                                                               |
| 6  | ✅      | Session management with revoke                                                                  |
| 7  | ✅      | Account sidebar + layout components                                                             |
| 8  | ✅      | Commerce sidebar navigation                                                                     |
| 9  | ✅      | Profile form uses shared `AuthSchema` with email validation                                     |
| 10 | ✅      | Commerce sub-pages (order, payment, shipment, review) implemented                               |
| 11 | ✅      | Studio customers page with admin-only access guard                                              |
| 12 | ✅      | Studio user management section with role-based grouping and permissions display                  |
| 13 | ✅      | Admin actions for updating roles and banning/unbanning users                                    |
| 14 | 🟡     | Add pagination to Studio customers list (currently fixed page size)                              |
| 15 | 🟡     | Add search/filter on Studio customers list (by name, email, role)                                |
| 16 | ❌      | Replace Studio customers listing with DataTable (sorting, filtering, pagination)                 |
| 17 | ❌      | Add customer detail page in Studio with order history, addresses, and account info              |
| 18 | ❌      | Add account dashboard summary cards (total orders, wishlist items, saved addresses)             |
| 19 | ❌      | Add loading skeleton for account dashboard                                                      |
| 20 | ❌      | Add welcome message with user's name on account dashboard                                       |
| 21 | ❌      | Add recent orders preview on account dashboard                                                  |
| 22 | ❌      | Add profile completion progress indicator (avatar, name, phone, address)                        |
| 23 | ❌      | Add avatar upload with image preview on profile page                                            |
| 24 | ❌      | Add notification preferences page (email opt-in/out per notification type)                      |
| 25 | ❌      | Add account activity log (recent logins, password changes, two-factor events)                   |
| 26 | ❌      | Wrap all account forms in `FormCard` component                                                   |
| 27 | ❌      | Migrate account action toasts to `toast.promise()` pattern                                       |
| 28 | ❌      | Add role badge display (lucide-react Shield) on Studio customer cards                            |
| 29 | ❌      | Add "Last active" timestamp on Studio customer list                                              |
| 30 | ❌      | Add ban/unban confirmation dialog with reason input field                                        |
| 31 | ❌      | Add user role change confirmation dialog                                                         |
| 32 | ❌      | Add export customers list as CSV functionality in Studio (lucide-react Download)                 |
| 33 | ❌      | Add `type: "avatar"` upload field to profile form — currently no image upload; `user.image` only set via OAuth |
| 34 | ❌      | Wire avatar upload to Better Auth `updateUser({ image: url })` on upload completion                            |
| 35 | ❌      | Add avatar fallback chain: uploaded image → OAuth avatar → DiceBear identicon                                  |

---

### Phase 12: Address Management

**Module:** Address (`src/module/address/`)
**Status:** ✅ Complete
**Dependencies:** Phase 11 (Account)

| #  | Status | Task                                                                                             |
| -- | ------ | ------------------------------------------------------------------------------------------------ |
| 1  | ✅      | DB schema: `address` table with user relation and type enum (billing/shipping)                   |
| 2  | ✅      | tRPC API: `getMany`, `create`, `update`, `delete`, `setDefault` with ownership checks            |
| 3  | ✅      | API message constants defined                                                                    |
| 4  | ✅      | Account address page with list, summary, and commerce sidebar layout                             |
| 5  | ✅      | `useAddress` hook with create/update/delete/setDefault mutations                                 |
| 6  | ✅      | Address form components: `AddressCreateForm`, `AddressEditForm` (Zod + Form, dedicated pages)    |
| 7  | ✅      | Address card component with edit link, delete, set-default actions                               |
| 8  | ✅      | Address item list with loading skeletons, empty state, add-address CTA                           |
| 9  | ✅      | Address summary with counts by type and add-address CTA                                          |
| 10 | ✅      | Dedicated pages: `/account/commerce/address/new`, `/account/commerce/address/[id]/edit`          |
| 11 | ✅      | Routes: `PATH.ACCOUNT.ADDRESS`, `PATH.ACCOUNT.ADDRESS_NEW`, `PATH.ACCOUNT.ADDRESS_EDIT(id)`     |
| 12 | ❌      | Add address type filter tabs (All / Shipping / Billing)                                          |
| 13 | ❌      | Add default address indicator badge (lucide-react Star) on address card                          |
| 14 | ❌      | Add tooltip on set-default button: "Set as default address"                                      |
| 15 | ❌      | Add confirmation dialog before deleting an address                                               |
| 16 | ❌      | Wrap address forms in `FormCard` component                                                       |
| 17 | ❌      | Add phone number and zip code format validation to address fields                                |
| 18 | ❌      | Migrate address CRUD toasts to `toast.promise()` pattern                                         |
| 19 | ❌      | Add "Copy address" action (lucide-react Copy) to duplicate an existing address                   |
| 20 | ❌      | Add inline address preview card in checkout address selection step                               |
| 21 | ❌      | Add address limit indicator (e.g., "3 of 10 addresses used")                                     |
| 22 | ❌      | Add address card hover state with subtle border highlight                                        |

---

### Phase 13: Cart

**Module:** Cart (`src/module/cart/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 9 (Product Variant), Phase 10 (Inventory)

| #  | Status | Task                                                                                                  |
| -- | ------ | ----------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `cart` + `cart_line` tables with relations and indexes                                     |
| 2  | ✅      | tRPC API: `get`, `getUserCart`, `add`, `update`, `remove`, `clear`, `getTotals`, `merge`              |
| 3  | ✅      | Zod contract validation (`cart.schema.ts`)                                                            |
| 4  | ✅      | Guest cart via `sessionId` support                                                                    |
| 5  | ✅      | Cart merge on login (guest → user)                                                                    |
| 6  | ✅      | Inventory reservation on add-to-cart                                                                  |
| 7  | ✅      | Add-to-cart UI flow wired on PDP                                                                      |
| 8  | ✅      | Account cart page renders items with quantity controls and summary                                    |
| 9  | ✅      | `useCart` hook for state management                                                                   |
| 10 | ✅      | Cart button component with badge and tooltip (wired to `useCart`)                                     |
| 11 | 🟡     | Add max quantity validation (cannot exceed available inventory)                                        |
| 12 | 🟡     | Handle out-of-stock items gracefully in cart (warning badge, disable checkout)                         |
| 13 | ❌      | Add cart item count limit per line item (configurable max quantity)                                    |
| 14 | ❌      | Add cart expiry / stale reservation cleanup logic (release reservations after timeout)                |
| 15 | ❌      | Add cart drawer/sheet component in site header (lucide-react ShoppingCart — slide-out mini cart)       |
| 16 | ❌      | Add "Continue Shopping" link on empty cart page (lucide-react ArrowLeft)                              |
| 17 | ❌      | Add cart item image with clickable product link                                                       |
| 18 | ❌      | Add quantity increment/decrement buttons (lucide-react Plus/Minus icons)                              |
| 19 | ❌      | Add remove item button (lucide-react Trash2) with confirmation toast                                  |
| 20 | ❌      | Add "Save for later" action (lucide-react Heart — move to wishlist from cart)                         |
| 21 | ❌      | Add loading skeleton for cart page                                                                    |
| 22 | ❌      | Add empty state with illustration and "Start Shopping" CTA                                            |
| 23 | ❌      | Add cart summary sidebar (subtotal, estimated tax, total) with sticky positioning on desktop          |
| 24 | ❌      | Add success toast with "View Cart" action link on add-to-cart                                         |
| 25 | ❌      | Add cart line item subtotal display (quantity × price)                                                 |
| 26 | ❌      | Add "Clear cart" button (lucide-react Trash) with `ConfirmDialog`                                     |
| 27 | ❌      | Add cart page `PageHeader` with item count in title                                                   |
| 28 | ❌      | Add cart item variant details display (color, size attributes)                                        |
| 29 | ❌      | Add cart update debounce on quantity change (avoid rapid API calls)                                    |
| 30 | ❌      | Add cart badge pulse animation on item count change                                                   |
| 31 | ❌      | Add free shipping threshold progress bar on cart summary                                              |
| 32 | ❌      | Migrate cart CRUD toasts to `toast.promise()` pattern                                                  |

---

### Phase 14: Wishlist

**Module:** Wishlist (`src/module/wishlist/`)
**Status:** ✅ Complete
**Dependencies:** Phase 9 (Product Variant)

| #  | Status | Task                                                                                        |
| -- | ------ | ------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `wishlist` table with user/variant relations                                     |
| 2  | ✅      | tRPC API: `get`, `add`, `remove` with Zod contracts                                        |
| 3  | ✅      | API message constants defined                                                               |
| 4  | ✅      | `useWishlist` hook with add/remove/clear/move-to-cart mutations wired to API                |
| 5  | ✅      | Wishlist button and PDP wishlist toggle fully wired to API                                  |
| 6  | ✅      | Account wishlist page with wishlist list and summary layout                                 |
| 7  | ✅      | Wishlist item list with product details, loading, and empty states                          |
| 8  | ✅      | "Move to Cart" functionality (wishlist → cart with cart totals refresh)                     |
| 9  | ❌      | Add wishlist item count display in section header                                           |
| 10 | ❌      | Add loading skeleton for wishlist page                                                      |
| 11 | ❌      | Add empty state with illustration and "Browse Products" CTA                                 |
| 12 | ❌      | Add "Remove all" button (lucide-react Trash) with `ConfirmDialog`                           |
| 13 | ❌      | Add wishlist item price display with availability indicator                                 |
| 14 | ❌      | Add "Share wishlist" feature (lucide-react Share2 — generate shareable link)                |
| 15 | ❌      | Add sort options for wishlist (date added, price low-high, price high-low)                  |
| 16 | ❌      | Add product image thumbnail in wishlist item card                                           |
| 17 | ❌      | Add wishlist page `PageHeader` with item count in title                                     |
| 18 | ❌      | Add wishlist button heart fill/unfill animation on toggle                                   |
| 19 | ❌      | Add "Move all to Cart" bulk action (lucide-react ShoppingCart)                              |
| 20 | ❌      | Add out-of-stock indicator (lucide-react AlertCircle) on wishlist items                     |
| 21 | ❌      | Add price change indicator (lucide-react TrendingDown — "Price dropped!")                   |
| 22 | ❌      | Migrate wishlist toasts to `toast.promise()` pattern                                         |

---

### Phase 15: Order Management

**Module:** Order (`src/module/order/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 13 (Cart), Phase 12 (Address)

| #  | Status | Task                                                                                                  |
| -- | ------ | ----------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `order` + `order_item` tables with full relations                                          |
| 2  | ✅      | DB enums: `order_status` (pending/paid/shipped/delivered/cancelled)                                   |
| 3  | ✅      | tRPC API: `get`, `getMany`, `create` (from cart, transactional), `updateStatus`                       |
| 4  | ✅      | Inventory deduction on order placement                                                                |
| 5  | ✅      | API message constants and routes defined                                                              |
| 6  | ✅      | Account order list and detail pages with `OrderList` + `OrderDetailSection` UI                        |
| 7  | ✅      | Studio order management pages for listing, detail view, and status updates                            |
| 8  | ✅      | Store order detail page and checkout confirmation page wired to order API                             |
| 9  | ✅      | Order status timeline UI component (`OrderTimeline`) and summary (`OrderSummary`)                     |
| 10 | 🟡     | Add filtering to Studio order list (by status, date range, customer name)                              |
| 11 | 🟡     | Add search on Studio order list (by order ID, customer email)                                          |
| 12 | 🟡     | Add pagination to Studio order list (offset-based with page size selector)                             |
| 13 | 🟡     | Add filtering to account order list (by status)                                                        |
| 14 | 🟡     | Add pagination to account order list                                                                   |
| 15 | ❌      | Replace Studio order listing with DataTable (sorting, filtering, pagination)                           |
| 16 | ❌      | Add customer-initiated order cancellation flow (before shipment only)                                  |
| 17 | ❌      | Add order cancellation confirmation dialog with reason input                                           |
| 18 | ❌      | Add inventory restoration on order cancellation (return reserved stock)                                |
| 19 | ❌      | Add order status change validation (prevent invalid transitions: delivered → pending)                  |
| 20 | ❌      | Add order status color-coded badges using `StatusBadge` component                                      |
| 21 | ❌      | Add order total and item count display in Studio listing                                               |
| 22 | ❌      | Add order date formatting (relative: "2 days ago", absolute on hover via Tooltip)                      |
| 23 | ❌      | Add loading skeleton for order list and detail pages                                                   |
| 24 | ❌      | Add empty state for zero orders with "Start Shopping" CTA                                              |
| 25 | ❌      | Add order detail: expand/collapse items section (lucide-react ChevronDown/Up)                          |
| 26 | ❌      | Add order detail: shipping address display card                                                        |
| 27 | ❌      | Add order detail: billing address display card                                                         |
| 28 | ❌      | Add order detail: payment information summary card                                                     |
| 29 | ❌      | Add order detail: shipment tracking section (integrated from Phase 18)                                 |
| 30 | ❌      | Add "Reorder" action button (lucide-react RefreshCw) on completed orders                              |
| 31 | ❌      | Add printable order invoice view (`/store/order/[id]/invoice`)                                         |
| 32 | ❌      | Add PDF invoice download using browser print API (lucide-react Printer)                                |
| 33 | ❌      | Add order confirmation email resend button in Studio (lucide-react Mail)                               |
| 34 | ❌      | Add order page `PageHeader` with order ID and status                                                   |
| 35 | ❌      | Migrate order status toasts to `toast.promise()` pattern                                               |
| 36 | ❌      | Add breadcrumb trail: Account → Orders → [Order ID]                                                    |
| 37 | ❌      | Add "Contact Support" link (lucide-react HelpCircle) on order detail page                              |
| 38 | ❌      | Add order notes field (admin-only internal notes, lucide-react StickyNote)                             |
| 39 | ❌      | Add order timeline with all status changes, timestamps, and actor                                      |
| 40 | ❌      | Add search on account order list (by order ID)                                                         |

---

### Phase 16: Payment Processing

**Module:** Payment (`src/module/payment/`)
**Status:** 🟡 Partial (Razorpay)
**Dependencies:** Phase 15 (Order)

| #  | Status | Task                                                                                                     |
| -- | ------ | -------------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `payment` table with order relation, provider enums, metadata                                 |
| 2  | ✅      | DB enums: `payment_status`, `payment_provider` (stripe/razorpay/paypal/cod)                              |
| 3  | ✅      | tRPC API: `createIntent`, `confirm`, `getStatus` with Razorpay order + signature verification            |
| 4  | ✅      | Routes defined (`PATH.STUDIO.PAYMENTS`)                                                                  |
| 5  | ✅      | Razorpay SDK integration: `razorpay.client`, `razorpay.options`, `razorpay.verify`, `razorpay.provider`  |
| 6  | ✅      | Webhook handler `/api/webhooks/razorpay` (signature verification, payment.captured/failed)               |
| 7  | ✅      | Payment flow UI in checkout (Place order / Pay with Razorpay)                                            |
| 8  | ✅      | Env: `RAZORPAY_API_KEY`, `RAZORPAY_API_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_WEBHOOK_SECRET` |
| 9  | 🟡     | Build account payment page content (currently empty — needs payment history list)                         |
| 10 | ❌      | Add payment history list with status badges and transaction amounts                                      |
| 11 | ❌      | Add payment detail view (transaction ID, method, timestamp, order link)                                  |
| 12 | ❌      | Add payment receipt component (printable/downloadable, lucide-react FileText)                            |
| 13 | ❌      | Add Studio payment management page with DataTable                                                        |
| 14 | ❌      | Add Studio payment detail page with transaction info and refund action                                   |
| 15 | ❌      | Add Cash on Delivery (COD) payment method flow                                                           |
| 16 | ❌      | Add payment status color-coded badges using `StatusBadge` component                                      |
| 17 | ❌      | Add payment amount formatting with currency symbol (locale-aware `PriceBadge`)                           |
| 18 | ❌      | Add payment method icon display (lucide-react CreditCard, Banknote for COD)                              |
| 19 | ❌      | Add loading skeleton for payment pages                                                                   |
| 20 | ❌      | Add empty state for zero payments                                                                        |
| 21 | ❌      | Add payment date formatting (relative and absolute)                                                      |
| 22 | ❌      | Add payment failure handling with retry option (lucide-react RefreshCw)                                  |
| 23 | ❌      | Add payment processing spinner with clear messaging during Razorpay checkout                             |
| 24 | ❌      | Add payment page `PageHeader` with total amount                                                          |
| 25 | ❌      | Migrate payment toasts to `toast.promise()` pattern                                                      |
| 26 | ❌      | Add breadcrumb trail: Account → Payments → [Payment ID]                                                  |
| 27 | ❌      | Add Razorpay error user-friendly messages (network, declined, timeout)                                   |
| 28 | ❌      | Add payment method display on order detail page                                                          |

---

### Phase 17: Checkout Flow

**Module:** Checkout (`src/module/checkout/`) + store checkout pages
**Status:** ✅ Complete
**Dependencies:** Phase 13 (Cart), Phase 12 (Address), Phase 15 (Order), Phase 16 (Payment)

| #  | Status | Task                                                                                                               |
| -- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| 1  | ✅      | Checkout page route (`/store/checkout`) with auth guard, Shell, metadata                                           |
| 2  | ✅      | Checkout module: `checkout.schema`, `use-checkout`, `CheckoutForm` with Form + validation                          |
| 3  | ✅      | Multi-step form: cart review → address selection → order summary → place order (Razorpay)                          |
| 4  | ✅      | Address selection: shipping/billing radio, same-as-shipping switch, "Add new address" link                         |
| 5  | ✅      | Cart review section (items, images, qty, price) and order summary (subtotal, tax, shipping, total)                 |
| 6  | ✅      | Payment: Razorpay checkout.js via Place order button; terms agreement required                                     |
| 7  | ✅      | Cart-to-order conversion: `initiateCheckout` → order.create + payment.createIntent → Razorpay → confirm → redirect |
| 8  | ✅      | Order confirmation page with order details (`/store/checkout/confirmation`) + loading state                        |
| 9  | ✅      | Cart summary "Proceed to Checkout" links to `/store/checkout`                                                      |
| 10 | ❌      | Add checkout step indicator/progress bar (Step 1 of 4 with lucide-react Check for completed steps)                |
| 11 | ❌      | Add step navigation with back/next buttons and per-step validation                                                |
| 12 | ❌      | Add cart item summary with collapse/expand in checkout                                                             |
| 13 | ❌      | Add address selection cards with radio buttons and visual selected state                                           |
| 14 | ❌      | Add "Edit address" inline action in checkout address step (lucide-react Pencil)                                    |
| 15 | ❌      | Add order summary sticky sidebar on desktop, collapsible card on mobile                                            |
| 16 | ❌      | Add terms and conditions link (opens legal page in new tab, lucide-react ExternalLink)                             |
| 17 | ❌      | Add loading state overlay during payment processing with "Processing your payment..." messaging                   |
| 18 | ❌      | Add error recovery: return to checkout with error message on payment failure                                       |
| 19 | ❌      | Add scroll-to-first-error on form field validation failure                                                         |
| 20 | ❌      | Add checkout page guard: redirect to cart page if cart is empty                                                     |
| 21 | ❌      | Add estimated delivery date display in checkout summary                                                            |
| 22 | ❌      | Add coupon code input field in checkout (UI only — wired in Phase 24)                                              |
| 23 | ❌      | Add checkout mobile-responsive layout (stacked steps, bottom-sheet summary)                                        |
| 24 | ❌      | Add order confirmation page with animated success icon (lucide-react CheckCircle)                                  |
| 25 | ❌      | Add "Continue Shopping" and "Track Order" buttons on confirmation page                                             |
| 26 | ❌      | Add "Order confirmation email sent" indicator on confirmation page (lucide-react Mail)                             |
| 27 | ❌      | Ensure all checkout steps use consistent form layout with `FormCard` wrapper                                       |
| 28 | ❌      | Add checkout `PageHeader` with step title                                                                          |

---

### Phase 18: Shipment & Fulfillment

**Module:** Shipment (`src/module/shipment/`)
**Status:** ✅ Complete
**Dependencies:** Phase 15 (Order)

| #  | Status | Task                                                                                                          |
| -- | ------ | ------------------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `shipment` table with expanded `shipmentStatusEnum` (8 values) and order relation                  |
| 2  | ✅      | DB migration: `0003_shipment_status_and_columns.sql` (enum + estimatedDeliveryAt, shippingRate, weight, notes)|
| 3  | ✅      | tRPC API: `create`, `updateStatus`, `getByOrder`, `get`, `getMany`, `getByTracking`                           |
| 4  | ✅      | Zod contracts with pagination; `shipment.types.ts`                                                            |
| 5  | ✅      | API message constants and routes defined                                                                      |
| 6  | ✅      | Account shipment page with orders + shipments list                                                            |
| 7  | ✅      | Studio fulfillment: `/studio/shipping` list and `/studio/shipping/[id]` detail pages                          |
| 8  | ✅      | Studio sidebar: Shipping under Orders section                                                                 |
| 9  | ✅      | Studio order detail: `OrderShipmentSection` with create shipment dialog, status form, timeline                |
| 10 | ✅      | UI components: status-badge, timeline, card, list, tracking-section, shipment-form, status-form               |
| 11 | ✅      | `useShipment` hook with getByOrder, createShipment, updateStatus                                              |
| 12 | ✅      | Customer-facing tracking: `ShipmentTrackingSection` on account and store order detail pages                   |
| 13 | ❌      | Add estimated shipping rate calculation (weight-based or flat rate configuration)                              |
| 14 | ❌      | Add shipping zone configuration in Studio (regions/countries/pin codes)                                       |
| 15 | ❌      | Add shipping method management (standard, express, overnight with rate/ETA)                                   |
| 16 | ❌      | Add shipment status color-coded badges using `StatusBadge` component                                          |
| 17 | ❌      | Add tracking number copy-to-clipboard button (lucide-react Copy)                                              |
| 18 | ❌      | Add estimated delivery date display with countdown (lucide-react Clock)                                       |
| 19 | ❌      | Add shipment weight and dimensions display                                                                    |
| 20 | ❌      | Add loading skeleton for shipment pages                                                                       |
| 21 | ❌      | Add empty state for zero shipments                                                                            |
| 22 | ❌      | Replace Studio shipment listing with DataTable (sorting, filtering, pagination)                               |
| 23 | ❌      | Add shipment status filter tabs (All / Pending / In Transit / Delivered)                                      |
| 24 | ❌      | Add bulk shipment status update in Studio                                                                     |
| 25 | ❌      | Add breadcrumb trail: Orders → [Order] → Shipments → [Shipment]                                               |
| 26 | ❌      | Wrap shipment forms in `FormCard` component                                                                    |
| 27 | ❌      | Migrate shipment toasts to `toast.promise()` pattern                                                           |
| 28 | ❌      | Add shipment page `PageHeader` with tracking number                                                            |

---

### Phase 19: Email & Notifications

**Module:** Email (`src/shared/components/mail/`, `src/core/mail/`)
**Status:** ✅ Complete
**Dependencies:** Phase 15 (Order), Phase 16 (Payment)

| #  | Status | Task                                                                                           |
| -- | ------ | ---------------------------------------------------------------------------------------------- |
| 1  | ✅      | Resend client integration                                                                      |
| 2  | ✅      | Templates: welcome, verification, password reset, delete account                               |
| 3  | ✅      | Order confirmation template + wired to `payment.confirm` and Razorpay webhook                  |
| 4  | ✅      | Payment confirmation email template + `sendPaymentConfirmationEmail`                           |
| 5  | ✅      | Shipment notification email template + wired on shipment create/updateStatus                   |
| 6  | ✅      | Order status change email template + wired in `order.updateStatus`                             |
| 7  | ✅      | Low stock alert email (admin) + wired after inventory deduction in order.create                |
| 8  | ✅      | Centralized `notification.service.ts`                                                          |
| 9  | ✅      | Professional ShopHub branding in all templates                                                 |
| 10 | ❌      | Add unsubscribe link in all marketing/notification emails                                      |
| 11 | ❌      | Add email footer with company info, social links, and support contact                          |
| 12 | ❌      | Ensure consistent email template styling (colors, fonts, spacing match brand)                  |
| 13 | ❌      | Add customer name personalization in all email template greetings                              |
| 14 | ❌      | Add order items list with images in order confirmation email                                   |
| 15 | ❌      | Add tracking link (clickable) in shipment notification email                                   |
| 16 | ❌      | Add notification preferences page in account (opt-in/opt-out per email type)                   |
| 17 | ❌      | Add in-app notification bell icon (lucide-react Bell) in header (future WebSocket/polling hook)|
| 18 | ❌      | Add email template preview tool in Studio (dev mode only, lucide-react Eye)                    |
| 19 | ❌      | Add email delivery status display in Studio (sent/failed/pending)                              |
| 20 | ❌      | Add cart abandonment email template (wired in Phase 30)                                        |
| 21 | ❌      | Add re-engagement email template for inactive customers                                        |
| 22 | ❌      | Add order review request email template (sent N days after delivery)                           |

---

### Phase 20: Legal & Cookies

**Module:** Legal (`src/module/legal/`) + Cookies (`src/module/cookies/`)
**Status:** 🟡 Partial
**Dependencies:** Phase 1

| #  | Status | Task                                                                                    |
| -- | ------ | --------------------------------------------------------------------------------------- |
| 1  | ✅      | Legal pages with dynamic `[slug]` routing                                               |
| 2  | ✅      | Legal sidebar + table of contents components                                            |
| 3  | ✅      | Policy content rendering component                                                      |
| 4  | ✅      | Cookie consent banner component                                                         |
| 5  | ✅      | Cookie utility functions                                                                |
| 6  | ✅      | `useCookieConsent` hook                                                                 |
| 7  | 🟡     | Replace placeholder legal content (currently "Last updated: October 2025")               |
| 8  | ❌      | Write Privacy Policy: data collection, storage, sharing, user rights                    |
| 9  | ❌      | Write Terms of Service: purchase terms, liability, dispute resolution                   |
| 10 | ❌      | Write Cookie Policy: cookie types, purposes, management instructions                   |
| 11 | ❌      | Write Return & Refund Policy: timeframes, conditions, process                           |
| 12 | ❌      | Write Shipping Policy: delivery times, regions, rates, restrictions                     |
| 13 | ❌      | Add dynamic "Last updated" date to each policy (not hardcoded)                          |
| 14 | ❌      | Add cookie preference management page (granular consent toggles per cookie type)        |
| 15 | ❌      | Add cookie banner with accept/reject/customize options                                  |
| 16 | ❌      | Add GDPR compliance: data export request form (lucide-react Download)                   |
| 17 | ❌      | Add GDPR compliance: account deletion confirmation with full data purge                 |
| 18 | ❌      | Add legal page table of contents with smooth scroll to anchored sections                |
| 19 | ❌      | Add legal page print-friendly stylesheet                                                |
| 20 | ❌      | Add breadcrumb trail: Legal → [Policy Name]                                              |
| 21 | ❌      | Ensure legal pages use consistent page layout with `PageHeader`                         |
| 22 | ❌      | Add legal page metadata (title, description) for SEO                                    |
| 23 | ❌      | Add legal footer links on all site pages (Privacy, Terms, Cookies)                      |
| 24 | ❌      | Add cookie consent analytics integration hook (track consent rates)                     |

---

### Phase 21: Site & Marketing Pages

**Module:** Site (`src/module/site/`) + Support pages
**Status:** 🟡 Partial
**Dependencies:** Phase 8 (Product)

| #  | Status | Task                                                                                                      |
| -- | ------ | --------------------------------------------------------------------------------------------------------- |
| 1  | ✅      | Homepage with hero, featured categories, shop-by grid, FAQ accordion                                     |
| 2  | ✅      | Category → Subcategory → Series → Variant breadcrumb navigation                                          |
| 3  | ✅      | Product listing by series with variant cards                                                              |
| 4  | ✅      | Loading skeletons for all catalog pages                                                                   |
| 5  | 🟡     | Complete About page with company story, mission, and team section                                          |
| 6  | 🟡     | Complete Newsletter page with email subscription form and confirmation                                     |
| 7  | 🟡     | Complete FAQ page with categorized accordion questions and search                                          |
| 8  | 🟡     | Complete Help Center page with topic categories and article cards                                          |
| 9  | 🟡     | Complete Contact page with contact form, map placeholder, and business info                                |
| 10 | 🟡     | Complete Returns page with step-by-step return process and policy link                                     |
| 11 | 🟡     | Complete Shipping page with delivery zones, times, and rate table                                          |
| 12 | ❌      | Add product search bar in site header using `cmdk` command palette (lucide-react Search)                  |
| 13 | ❌      | Add search results page (`/store/search?q=`) with product grid and filtering                              |
| 14 | ❌      | Add search suggestions/autocomplete dropdown in header search                                             |
| 15 | ❌      | Add keyboard shortcut: Cmd/Ctrl+K to open search palette                                                 |
| 16 | ❌      | Build support ticket creation form (subject, description, category select)                                |
| 17 | ❌      | Build support ticket list page with status filter tabs                                                    |
| 18 | ❌      | Build support ticket detail page with message thread and reply form                                       |
| 19 | ❌      | Add ticket status tracking (open, in progress, resolved, closed) with `StatusBadge`                       |
| 20 | ❌      | Add Studio ticket management page for admin with DataTable                                                |
| 21 | ❌      | Add "New Arrivals" section on homepage (products added in last 30 days)                                   |
| 22 | ❌      | Add "Best Sellers" section on homepage (placeholder — wired in Phase 30)                                  |
| 23 | ❌      | Add "On Sale" products section on homepage (products with active discounts)                               |
| 24 | ❌      | Add promotional banner component (configurable hero/CTA, lucide-react Megaphone)                         |
| 25 | ❌      | Add site header navigation mega-menu for category browsing                                                |
| 26 | ❌      | Add site header sticky behavior with scroll-up reveal animation                                           |
| 27 | ❌      | Add footer with sitemap links, social icons (lucide-react), newsletter signup                             |
| 28 | ❌      | Add mobile navigation drawer with hamburger menu (lucide-react Menu)                                      |
| 29 | ❌      | Add "Back to top" scroll button on long pages (lucide-react ArrowUp)                                      |
| 30 | ❌      | Add page transition animations between routes (View Transitions API)                                      |
| 31 | ❌      | Add homepage hero carousel with multiple slides and auto-advance                                          |
| 32 | ❌      | Add homepage testimonials/reviews section (placeholder)                                                   |
| 33 | ❌      | Add loading skeleton for About, FAQ, Contact pages                                                        |
| 34 | ❌      | Enhance 404 page with search suggestions and navigation links                                             |
| 35 | ❌      | Add store category sidebar navigation on listing pages (lucide-react LayoutGrid)                          |
| 36 | ❌      | Ensure all marketing pages use consistent Shell + Section layout                                          |
| 37 | ❌      | Add social share buttons (lucide-react Share2) on product and blog pages                                  |
| 38 | ❌      | Add newsletter subscription section in footer on all store pages                                          |
| 39 | ❌      | Add site-wide announcement bar (configurable, dismissible, lucide-react X to close)                       |
| 40 | ❌      | Add responsive hero image optimization (different sizes per breakpoint via `next/image`)                  |
| 41 | ❌      | Add accessibility: skip-to-content link, ARIA landmarks on all pages                                     |
| 42 | ❌      | Build Blog listing page (`/blog`) with post cards (title, excerpt, date, author)                          |
| 43 | ❌      | Build Blog post page (`/blog/[slug]`) with MDX content rendering                                          |
| 44 | ❌      | Add blog post metadata (author, date, reading time, category)                                             |
| 45 | ❌      | Add blog sidebar with categories, recent posts, and search                                                |

---

### Phase 22: SEO & Production Readiness

**Module:** Cross-cutting
**Status:** 🟡 Partial
**Dependencies:** Phase 17 (Checkout), Phase 21 (Site)

| #  | Status | Task                                                                                              |
| -- | ------ | ------------------------------------------------------------------------------------------------- |
| 1  | ✅      | React Compiler enabled                                                                            |
| 2  | ✅      | View Transitions API enabled                                                                      |
| 3  | ✅      | Image optimization via `next/image`                                                               |
| 4  | ✅      | Web Vitals tracking utility                                                                       |
| 5  | ✅      | Global error, not-found, forbidden, loading pages                                                 |
| 6  | ✅      | Vercel-ready config with Blob storage and Neon DB                                                 |
| 7  | 🟡     | Improve page metadata on all pages (many are basic/missing)                                        |
| 8  | 🟡     | Replace site config placeholder values ("Logo", "example.com") with real brand data               |
| 9  | ❌      | Generate dynamic `sitemap.xml` (include all public routes: products, categories, legal, blog)     |
| 10 | ❌      | Add `robots.txt` with proper crawl directives and sitemap reference                               |
| 11 | ❌      | Add Open Graph meta tags for all public pages (title, description, image, URL)                    |
| 12 | ❌      | Add Twitter Card meta tags for product and blog pages                                             |
| 13 | ❌      | Add JSON-LD structured data for products (`Product` schema with price, availability, reviews)     |
| 14 | ❌      | Add JSON-LD structured data for organization (`Organization` schema)                              |
| 15 | ❌      | Add JSON-LD structured data for breadcrumbs (`BreadcrumbList` schema)                             |
| 16 | ❌      | Add JSON-LD structured data for FAQ page (`FAQPage` schema)                                       |
| 17 | ❌      | Add proper favicon set (favicon.ico, apple-touch-icon, `site.webmanifest`)                        |
| 18 | ❌      | Add canonical URL meta tags on all pages to prevent duplicate content                             |
| 19 | ❌      | Add CI/CD pipeline (GitHub Actions: lint, typecheck, build, test on PR)                           |
| 20 | ❌      | Add staging environment setup guide/configuration                                                 |
| 21 | ❌      | Add production deployment checklist document                                                      |
| 22 | ❌      | Add dynamic imports for heavy client components (code splitting / lazy loading)                   |
| 23 | ❌      | Add bundle analysis script (`@next/bundle-analyzer`) for optimization                             |
| 24 | ❌      | Optimize tRPC batch requests (combine related queries where possible)                             |
| 25 | ❌      | Add Vercel Speed Insights or Web Vitals dashboard integration                                    |
| 26 | ❌      | Add Sentry or similar error tracking integration for production                                  |
| 27 | ❌      | Add structured logging for API errors (context, timestamp, user, endpoint)                       |
| 28 | ❌      | Add CSP (Content Security Policy) headers                                                        |
| 29 | ❌      | Add security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)                  |
| 30 | ❌      | Add ARIA labels to all interactive elements (buttons, links, form fields)                         |
| 31 | ❌      | Verify keyboard navigation works for all custom components (dialogs, dropdowns, tabs)            |
| 32 | ❌      | Verify color contrast ratios meet WCAG AA for all text/background combinations                   |
| 33 | ❌      | Add reduced motion support (`prefers-reduced-motion` media query) for animations                 |
| 34 | ❌      | Add `loading.tsx` for missing route segments (account, studio sub-pages, store/checkout)          |
| 35 | ❌      | Add font subsetting for custom fonts to reduce bundle size                                       |
| 36 | ❌      | Add image lazy loading for below-fold images (native or Intersection Observer)                   |
| 37 | ❌      | Audit and remove unused dependencies from `package.json`                                         |
| 38 | ❌      | Add performance budget monitoring (max bundle size, max LCP, max CLS thresholds)                 |
| 39 | ❌      | Ensure all product/category/variant images have `alt` text for accessibility and SEO              |
| 40 | ❌      | Add OG image generation using product `baseImage` or variant `media[0].url` on PDP pages         |

---

### Phase 23: Testing Infrastructure

**Module:** Cross-cutting
**Status:** ❌ Not Started
**Dependencies:** Phase 17 (Checkout)

| #  | Status | Task                                                                                                  |
| -- | ------ | ----------------------------------------------------------------------------------------------------- |
| 1  | ❌      | Install and configure Vitest with `@vitejs/plugin-react` and path alias support                       |
| 2  | ❌      | Add Vitest setup file with global mocks (tRPC context, session, DB)                                   |
| 3  | ❌      | Create test utilities: mock tRPC context factory, mock session, mock DB queries                        |
| 4  | ❌      | Unit tests: category router (CRUD, slug validation, soft-delete filter)                               |
| 5  | ❌      | Unit tests: subcategory router (CRUD, duplicate slug check, cascading delete)                         |
| 6  | ❌      | Unit tests: series router (CRUD, access control, soft-delete)                                         |
| 7  | ❌      | Unit tests: attribute router (CRUD, search, series-scoped queries)                                    |
| 8  | ❌      | Unit tests: product router (CRUD, search, SEO fields, status transitions)                             |
| 9  | ❌      | Unit tests: product-variant router (CRUD, atomic creation with inventory)                             |
| 10 | ❌      | Unit tests: inventory router (CRUD, stock validation, reservation logic)                              |
| 11 | ❌      | Unit tests: cart router (add, update, remove, merge, totals, inventory reservation)                   |
| 12 | ❌      | Unit tests: wishlist router (add, remove, move to cart)                                               |
| 13 | ❌      | Unit tests: order router (create from cart, updateStatus, validation, cancellation)                   |
| 14 | ❌      | Unit tests: payment router (createIntent, confirm, webhook signature verification)                   |
| 15 | ❌      | Unit tests: shipment router (create, updateStatus, getByTracking)                                    |
| 16 | ❌      | Unit tests: address router (CRUD, ownership checks, setDefault)                                      |
| 17 | ❌      | Schema validation tests for all Zod contracts (valid input, invalid input, edge cases)                |
| 18 | ❌      | Utility tests: slug generation, soft-delete helpers, `API_RESPONSE` wrapper                          |
| 19 | ❌      | Utility tests: date formatting, URL helpers, data masking                                            |
| 20 | ❌      | Install and configure Playwright for E2E testing                                                     |
| 21 | ❌      | E2E: authentication flow (sign-up → verify email → sign-in → sign-out)                              |
| 22 | ❌      | E2E: social login flow (GitHub OAuth redirect and callback)                                          |
| 23 | ❌      | E2E: password reset flow (forgot → email link → reset → sign-in)                                    |
| 24 | ❌      | E2E: product browsing (home → category → subcategory → series → PDP)                                |
| 25 | ❌      | E2E: add to cart and cart management (add, update quantity, remove)                                   |
| 26 | ❌      | E2E: wishlist flow (add, remove, move to cart)                                                       |
| 27 | ❌      | E2E: checkout flow (cart → address selection → payment → order confirmation)                         |
| 28 | ❌      | E2E: order tracking (account → orders → order detail → shipment tracking)                            |
| 29 | ❌      | E2E: admin CRUD (create category → subcategory → series → product → variant)                         |
| 30 | ❌      | E2E: admin order management (view orders, update status, create shipment)                            |
| 31 | ❌      | E2E: account management (profile edit, password change, address CRUD)                                |
| 32 | ❌      | Add test coverage reporting (Vitest coverage with `istanbul`)                                        |
| 33 | ❌      | Set minimum coverage thresholds (70% statements, 60% branches)                                       |
| 34 | ❌      | Add CI test pipeline step (run unit + E2E tests on pull request)                                     |
| 35 | ❌      | Add visual regression testing for critical UI components (Playwright screenshots)                    |

---

## Post-MVP Phases (24–26)

> These features extend the core commerce engine after a stable MVP launch.

---

### Phase 24: Discount & Coupon System

**Module:** Discount (`src/module/discount/`)
**Status:** 🟡 Schema Only
**Dependencies:** Phase 15 (Order), Phase 8 (Product)

| #  | Status | Task                                                                                               |
| -- | ------ | -------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `discount` + `order_discount` tables with `discountTypeEnum`                            |
| 2  | ✅      | API message constants defined                                                                      |
| 3  | ✅      | Routes defined (`PATH.STUDIO.DISCOUNTS`)                                                           |
| 4  | ❌      | tRPC discount router: `create` with Zod contract validation                                       |
| 5  | ❌      | tRPC discount router: `update` with partial update support                                         |
| 6  | ❌      | tRPC discount router: `delete` (soft-delete)                                                       |
| 7  | ❌      | tRPC discount router: `get` by ID                                                                  |
| 8  | ❌      | tRPC discount router: `getMany` with pagination, sorting, filtering                               |
| 9  | ❌      | tRPC discount router: `validateCode` (check validity, expiry, usage limits)                        |
| 10 | ❌      | tRPC discount router: `applyToOrder` (calculate discount amount for given cart)                    |
| 11 | ❌      | tRPC discount router: `trackUsage` (increment usage count on order placement)                      |
| 12 | ❌      | Add Zod contracts for all discount operations                                                      |
| 13 | ❌      | Add discount type support: percentage, fixed amount, free shipping                                 |
| 14 | ❌      | Add discount scope: entire order, specific products, specific categories                           |
| 15 | ❌      | Add discount conditions: minimum order amount, minimum quantity                                    |
| 16 | ❌      | Add discount limits: max total uses, max uses per customer                                         |
| 17 | ❌      | Add discount date range: start date, end date, auto-expire on end date                             |
| 18 | ❌      | Add discount code generation utility (random alphanumeric, configurable length)                    |
| 19 | ❌      | Build Studio discount list page with DataTable (sorting, filtering, pagination)                    |
| 20 | ❌      | Build Studio discount create page with form                                                        |
| 21 | ❌      | Build Studio discount edit page with pre-filled form                                               |
| 22 | ❌      | Build Studio discount detail page with usage statistics                                            |
| 23 | ❌      | Add discount type selector (percentage/fixed/free shipping) in form with dynamic fields            |
| 24 | ❌      | Add date range picker for discount validity period                                                 |
| 25 | ❌      | Add product/category multi-select for scoped discounts                                             |
| 26 | ❌      | Add discount status badge (active/expired/scheduled/disabled) with `StatusBadge`                   |
| 27 | ❌      | Add discount usage count display (N of M used, lucide-react BarChart)                              |
| 28 | ❌      | Add bulk discount actions (activate, deactivate, delete)                                           |
| 29 | ❌      | Wire coupon code input in checkout to `discount.validateCode` API                                  |
| 30 | ❌      | Add applied discount display in checkout order summary                                             |
| 31 | ❌      | Add remove coupon button in checkout (lucide-react X)                                              |
| 32 | ❌      | Add discount validation error messages (expired, invalid, already used, min not met)               |
| 33 | ❌      | Add discount savings breakdown in order summary and confirmation                                   |
| 34 | ❌      | Add loading state for coupon validation spinner                                                    |
| 35 | ❌      | Add success toast on coupon apply with discount amount                                             |
| 36 | ❌      | Add "Sale" badge (lucide-react Tag) on product cards for items with active discounts               |
| 37 | ❌      | Add discount terms display (conditions, expiry, limits) on product page                            |
| 38 | ❌      | Wrap discount forms in `FormCard` component                                                        |

---

### Phase 25: Product Reviews & Ratings

**Module:** Review (`src/module/review/`)
**Status:** 🟡 Schema Only
**Dependencies:** Phase 8 (Product), Phase 15 (Order)

| #  | Status | Task                                                                                              |
| -- | ------ | ------------------------------------------------------------------------------------------------- |
| 1  | ✅      | DB schema: `review` table                                                                         |
| 2  | ✅      | API message constants defined                                                                      |
| 3  | 🟡     | Account review page exists but content is empty                                                    |
| 4  | ❌      | tRPC review router: `create` with Zod contract validation                                        |
| 5  | ❌      | tRPC review router: `update` (author only)                                                        |
| 6  | ❌      | tRPC review router: `delete` (author or admin)                                                    |
| 7  | ❌      | tRPC review router: `get` by ID                                                                   |
| 8  | ❌      | tRPC review router: `getMany` with pagination and sorting                                        |
| 9  | ❌      | tRPC review router: `getByProduct` with aggregated rating stats                                  |
| 10 | ❌      | tRPC review router: `moderate` (approve/reject/flag — admin only)                                |
| 11 | ❌      | Add Zod contracts for all review operations                                                       |
| 12 | ❌      | Add review eligibility check (customer must have a delivered order for the product)               |
| 13 | ❌      | Add one-review-per-order-item constraint                                                          |
| 14 | ❌      | Add review rating aggregation (average rating, count by star level)                               |
| 15 | ❌      | Build star rating component (interactive for input, static for display, lucide-react Star)        |
| 16 | ❌      | Build review form (star rating, title input, comment textarea, image upload)                      |
| 17 | ❌      | Build review display section on PDP (rating summary + review list)                                |
| 18 | ❌      | Add review filter by star rating (5, 4, 3, 2, 1 star tabs)                                       |
| 19 | ❌      | Add review sort options (most recent, highest rated, lowest rated)                                |
| 20 | ❌      | Add review pagination on PDP                                                                      |
| 21 | ❌      | Build account review page content (list of user's reviews with edit/delete)                       |
| 22 | ❌      | Add "Write a Review" CTA on delivered order items (lucide-react MessageSquare)                    |
| 23 | ❌      | Build Studio review moderation page with DataTable                                                |
| 24 | ❌      | Add review status filter in Studio (pending, approved, rejected, flagged)                         |
| 25 | ❌      | Add review approval/rejection actions with reason input in Studio                                 |
| 26 | ❌      | Add review detail modal with full content, images, and customer info                              |
| 27 | ❌      | Add review analytics dashboard: average rating, recent reviews, moderation queue count            |
| 28 | ❌      | Add star rating display on product cards in listing pages                                         |
| 29 | ❌      | Add review count badge on PDP (lucide-react MessageCircle)                                        |
| 30 | ❌      | Add loading skeleton for review sections                                                          |
| 31 | ❌      | Add empty state for zero reviews with "Be the first to review" CTA                               |
| 32 | ❌      | Add helpful/not helpful voting on reviews (lucide-react ThumbsUp/ThumbsDown)                     |
| 33 | ❌      | Add review image lightbox gallery (click to expand images)                                        |
| 34 | ❌      | Migrate review toasts to `toast.promise()` pattern                                                |
| 35 | ❌      | Add admin reply functionality (public response below customer review)                             |

---

### Phase 26: Refund Management

**Module:** Refund (`src/module/refund/`)
**Status:** ❌ Not Started
**Dependencies:** Phase 16 (Payment), Phase 15 (Order)

| #  | Status | Task                                                                                               |
| -- | ------ | -------------------------------------------------------------------------------------------------- |
| 1  | ❌      | Add DB enums: `refund_status` (pending, approved, processing, completed, rejected)                 |
| 2  | ❌      | Add DB enums: `refund_reason` (defective, wrong_item, not_as_described, changed_mind, other)       |
| 3  | ❌      | Add DB table: `refund` (orderId, amount, reason, status, notes, adminNotes, timestamps)            |
| 4  | ❌      | Add DB table: `refund_item` (refundId, orderItemId, quantity, amount)                              |
| 5  | ❌      | Add DB table: `refund_status_history` (refundId, fromStatus, toStatus, changedBy, notes, timestamp)|
| 6  | ❌      | tRPC refund router: `create` refund request (customer, with eligibility check)                     |
| 7  | ❌      | tRPC refund router: `approve` / `reject` refund (admin only, with reason)                          |
| 8  | ❌      | tRPC refund router: `process` refund (trigger payment gateway refund)                              |
| 9  | ❌      | tRPC refund router: `get` by ID                                                                    |
| 10 | ❌      | tRPC refund router: `getMany` with pagination, filtering by status                                |
| 11 | ❌      | tRPC refund router: `getByOrder` (all refunds for an order)                                        |
| 12 | ❌      | Add Zod contracts for all refund operations                                                        |
| 13 | ❌      | Add refund eligibility check (within return window, order delivered)                               |
| 14 | ❌      | Add partial refund support (refund specific items and amounts)                                     |
| 15 | ❌      | Build customer refund request form (select items, reason, description textarea)                    |
| 16 | ❌      | Build account refund list page with status tracking                                                |
| 17 | ❌      | Build account refund detail page with status timeline                                              |
| 18 | ❌      | Add refund status badges using `StatusBadge` component                                             |
| 19 | ❌      | Add refund request CTA on eligible delivered orders (lucide-react RotateCcw)                       |
| 20 | ❌      | Build Studio refund management page with DataTable                                                 |
| 21 | ❌      | Build Studio refund detail page with approve/reject/process actions                                |
| 22 | ❌      | Add refund review form with admin notes textarea                                                   |
| 23 | ❌      | Add refund approval confirmation dialog with amount verification                                   |
| 24 | ❌      | Add refund processing indicator with payment gateway status                                        |
| 25 | ❌      | Add refund analytics: total refunds, average amount, top reasons (lucide-react BarChart)          |
| 26 | ❌      | Add Razorpay refund API integration (full and partial refunds)                                     |
| 27 | ❌      | Add refund webhook handler for asynchronous refund status updates                                  |
| 28 | ❌      | Add refund email notification to customer (approved, processed, rejected)                          |
| 29 | ❌      | Add inventory restoration on refund completion (return stock for refunded items)                   |
| 30 | ❌      | Add loading skeleton for refund pages                                                              |
| 31 | ❌      | Add empty state for zero refunds                                                                   |
| 32 | ❌      | Migrate refund toasts to `toast.promise()` pattern                                                  |

---

## Enterprise Phases (27–31)

> These transform the platform into an enterprise-ready commerce system with auditability, analytics, and retention. Requires stable Post-MVP.

---

### Phase 27: Tax Configuration

**Module:** Tax (`src/module/tax/`)
**Status:** ❌ Not Started
**Dependencies:** Phase 8 (Product), Phase 15 (Order)

| #  | Status | Task                                                                                                 |
| -- | ------ | ---------------------------------------------------------------------------------------------------- |
| 1  | ❌      | Add DB table: `tax_class` (name, description, rate percentage)                                       |
| 2  | ❌      | Add DB table: `tax_zone` (name, country, state/region, zip range)                                    |
| 3  | ❌      | Add DB table: `tax_rule` (taxClassId, taxZoneId, rate, priority)                                     |
| 4  | ❌      | Add DB table: `tax_exemption` (userId, reason, certificate, expiry)                                  |
| 5  | ❌      | tRPC tax router: CRUD for tax classes with Zod contracts                                             |
| 6  | ❌      | tRPC tax router: CRUD for tax zones with Zod contracts                                               |
| 7  | ❌      | tRPC tax router: CRUD for tax rules with Zod contracts                                               |
| 8  | ❌      | tRPC tax router: `calculateTax` (compute tax for cart items based on shipping address)               |
| 9  | ❌      | Add tax calculation engine (match product tax class + customer zone → applicable rate)               |
| 10 | ❌      | Add product tax class assignment field in product form                                               |
| 11 | ❌      | Add tax display in cart summary (itemized tax breakdown)                                             |
| 12 | ❌      | Add tax display in checkout order summary                                                            |
| 13 | ❌      | Add tax line items in order and invoice                                                              |
| 14 | ❌      | Build Studio tax class management page with DataTable                                                |
| 15 | ❌      | Build Studio tax zone management page with DataTable                                                 |
| 16 | ❌      | Build Studio tax rule management page with DataTable                                                 |
| 17 | ❌      | Add tax exemption management for specific customers                                                  |
| 18 | ❌      | Wrap all tax forms in `FormCard` component                                                           |
| 19 | ❌      | Add loading skeletons for tax configuration pages                                                    |
| 20 | ❌      | Add tax rate percentage display with proper formatting                                               |
| 21 | ❌      | Add GST/VAT support with configurable tax display (inclusive/exclusive)                              |
| 22 | ❌      | Add tax configuration import/export (CSV)                                                            |
| 23 | ❌      | Add breadcrumb trail: Studio → Tax → [Tax Class / Zone / Rule]                                       |
| 24 | ❌      | Migrate tax CRUD toasts to `toast.promise()` pattern                                                  |

---

### Phase 28: Product Relationships (Cross-sell, Upsell, Bundles)

**Module:** Product Intelligence
**Status:** ❌ Not Started
**Dependencies:** Phase 8 (Product)

| #  | Status | Task                                                                                                  |
| -- | ------ | ----------------------------------------------------------------------------------------------------- |
| 1  | ❌      | Add DB table: `product_relationship` (sourceProductId, targetProductId, type, sortOrder)              |
| 2  | ❌      | Add DB table: `bundle_component` (bundleProductId, componentProductId, quantity, discount)            |
| 3  | ❌      | Add DB enum: `relationship_type` (cross_sell, upsell, bundle, accessory, related)                    |
| 4  | ❌      | tRPC product relationship router: `create`, `update`, `delete`, `getByProduct`                       |
| 5  | ❌      | tRPC bundle router: `create`, `update`, `delete`, `getComponents`, `calculatePrice`                  |
| 6  | ❌      | Add Zod contracts for all relationship and bundle operations                                          |
| 7  | ❌      | Add PDP cross-sell section ("Customers also bought", lucide-react ShoppingBag)                        |
| 8  | ❌      | Add PDP upsell section ("You might also like", lucide-react Sparkles)                                |
| 9  | ❌      | Add PDP accessory section ("Frequently bought together")                                             |
| 10 | ❌      | Add bundle pricing logic (sum of components minus bundle discount)                                   |
| 11 | ❌      | Add bundle "Add all to cart" action                                                                   |
| 12 | ❌      | Build Studio product relationship management UI (drag-and-drop ordering)                             |
| 13 | ❌      | Add product search/selector for adding relationships in Studio                                       |
| 14 | ❌      | Build Studio bundle management page with component list and pricing                                  |
| 15 | ❌      | Add relationship type selector (cross-sell/upsell/accessory) in Studio form                          |
| 16 | ❌      | Add bundle savings display on product card and PDP                                                   |
| 17 | ❌      | Add loading skeleton for relationship sections on PDP                                                |
| 18 | ❌      | Add empty state when no relationships are configured                                                 |
| 19 | ❌      | Wrap relationship forms in `FormCard` component                                                       |
| 20 | ❌      | Migrate relationship toasts to `toast.promise()` pattern                                              |
| 21 | ❌      | Add related products carousel component with horizontal scroll                                       |
| 22 | ❌      | Add automatic relationship suggestions based on order history (placeholder)                          |

---

### Phase 29: Loyalty & Rewards

**Module:** Loyalty (`src/module/loyalty/`)
**Status:** ❌ Not Started
**Dependencies:** Phase 15 (Order), Phase 11 (Account)

| #  | Status | Task                                                                                                    |
| -- | ------ | ------------------------------------------------------------------------------------------------------- |
| 1  | ❌      | Add DB table: `loyalty_tier` (name, minPoints, maxPoints, multiplier, benefits)                         |
| 2  | ❌      | Add DB table: `loyalty_account` (userId, points, tier, lifetime points)                                 |
| 3  | ❌      | Add DB table: `loyalty_point_transaction` (accountId, points, type, orderId, description)               |
| 4  | ❌      | tRPC loyalty router: `getAccount`, `getTransactions`, `redeemPoints`, `calculateEarnings`               |
| 5  | ❌      | tRPC loyalty router: CRUD for tiers (admin only)                                                        |
| 6  | ❌      | Add Zod contracts for all loyalty operations                                                            |
| 7  | ❌      | Add points calculation engine (order total × tier multiplier = points earned)                           |
| 8  | ❌      | Add automatic points credit after order delivery                                                        |
| 9  | ❌      | Add points deduction on refund/cancellation                                                             |
| 10 | ❌      | Add tier auto-promotion/demotion based on lifetime points                                               |
| 11 | ❌      | Build customer loyalty dashboard (points balance, tier status, transaction history)                     |
| 12 | ❌      | Add points balance display in account header (lucide-react Award)                                       |
| 13 | ❌      | Add tier progress bar (points needed for next tier)                                                     |
| 14 | ❌      | Add points earning preview on product cards and PDP ("Earn N points")                                   |
| 15 | ❌      | Add points redemption at checkout (apply points as discount)                                            |
| 16 | ❌      | Add points redemption calculator (N points = ₹X discount)                                               |
| 17 | ❌      | Build Studio loyalty program management page                                                            |
| 18 | ❌      | Build Studio tier management with DataTable (create, edit, delete tiers)                                |
| 19 | ❌      | Add Studio loyalty analytics (total points issued, redeemed, active members)                            |
| 20 | ❌      | Add loyalty points display on order confirmation page                                                   |
| 21 | ❌      | Add loading skeleton for loyalty pages                                                                  |
| 22 | ❌      | Add empty state for new loyalty members ("Start earning points!")                                       |
| 23 | ❌      | Wrap loyalty forms in `FormCard` component                                                               |
| 24 | ❌      | Migrate loyalty toasts to `toast.promise()` pattern                                                      |
| 25 | ❌      | Add welcome bonus points for first purchase                                                              |

---

### Phase 30: Analytics & Intelligence

**Module:** Product Analytics (`src/module/product-analytics/`)
**Status:** ❌ Not Started
**Dependencies:** Phase 13 (Cart), Phase 8 (Product)

| #  | Status | Task                                                                                                    |
| -- | ------ | ------------------------------------------------------------------------------------------------------- |
| 1  | ❌      | Add DB table: `cart_abandonment` (cartId, userId, items, totalValue, abandonedAt, recoveredAt)          |
| 2  | ❌      | Add DB table: `cart_abandonment_event` (abandonmentId, type, sentAt, clickedAt)                         |
| 3  | ❌      | Add DB table: `product_view_event` (productId, variantId, userId, sessionId, viewedAt, duration)       |
| 4  | ❌      | Add DB table: `analytics_session` (sessionId, userId, startedAt, endedAt, pages, referrer)             |
| 5  | ❌      | Add cart abandonment detection logic (cart inactive for N hours → mark as abandoned)                    |
| 6  | ❌      | Add recovery email sequence: reminder at 1h, 24h, 72h with cart link                                  |
| 7  | ❌      | Add product view event collection (track views, time on page, variant selections)                      |
| 8  | ❌      | tRPC analytics router: `getOverview`, `getSalesReport`, `getProductPerformance`                        |
| 9  | ❌      | tRPC analytics router: `getAbandonmentRate`, `getRecoveryRate`, `getTopAbandoned`                      |
| 10 | ❌      | tRPC analytics router: `getTrendingProducts`, `getPopularProducts`                                     |
| 11 | ❌      | Add Zod contracts for all analytics queries                                                             |
| 12 | ❌      | Build Studio analytics dashboard with `StatsCard` components                                            |
| 13 | ❌      | Add sales overview cards: total revenue, orders, average order value, conversion rate                  |
| 14 | ❌      | Add sales chart: revenue over time (daily/weekly/monthly) using chart library                          |
| 15 | ❌      | Add top products table: best sellers by revenue and quantity                                            |
| 16 | ❌      | Add customer analytics: new vs returning, geographic distribution                                      |
| 17 | ❌      | Add product performance table: views, conversion rate, revenue per product                             |
| 18 | ❌      | Add cart abandonment dashboard: rate, top abandoned products, recovery stats                            |
| 19 | ❌      | Add real-time metrics: active carts, active sessions, orders today                                     |
| 20 | ❌      | Add date range picker for all analytics views (today, 7d, 30d, 90d, custom)                            |
| 21 | ❌      | Add trending products API for homepage "Trending Now" section                                          |
| 22 | ❌      | Add popular products API for homepage "Best Sellers" section                                            |
| 23 | ❌      | Add loading skeletons for all analytics dashboard components                                            |
| 24 | ❌      | Add empty state for analytics with insufficient data                                                    |
| 25 | ❌      | Add export analytics data as CSV (lucide-react Download)                                                |
| 26 | ❌      | Add analytics page `PageHeader` with date range and export actions                                      |
| 27 | ❌      | Add inventory analytics: stock value, turnover rate, aging report                                       |
| 28 | ❌      | Add revenue analytics: gross vs net, refund impact, discount impact                                    |

---

### Phase 31: System-Wide Audit Logging

**Module:** Audit
**Status:** ❌ Not Started
**Dependencies:** All modules

| #  | Status | Task                                                                                                 |
| -- | ------ | ---------------------------------------------------------------------------------------------------- |
| 1  | ❌      | Add DB table: `audit_log` (actorId, actorType, action, entityType, entityId, changes, ip, timestamp)|
| 2  | ❌      | Add DB table: `audit_log_archive` (same schema, for older records after retention)                   |
| 3  | ❌      | Add DB table: `order_status_history` (orderId, fromStatus, toStatus, changedBy, notes, timestamp)    |
| 4  | ❌      | Add DB enum: `audit_action_type` (create, update, delete, login, logout, status_change, export)      |
| 5  | ❌      | Add audit middleware for all tRPC mutations (auto-log actor, action, entity, changes)                |
| 6  | ❌      | Add audit entry creation on: product CRUD, order status changes, user role changes                   |
| 7  | ❌      | Add audit entry creation on: inventory adjustments, payment events, refund actions                   |
| 8  | ❌      | Add audit entry creation on: login, logout, password change, two-factor events                       |
| 9  | ❌      | tRPC audit router: `getMany` with pagination, filtering by entity/action/actor/date                 |
| 10 | ❌      | tRPC audit router: `getByEntity` (all audit entries for a specific entity)                           |
| 11 | ❌      | Add Zod contracts for audit queries                                                                  |
| 12 | ❌      | Build Studio audit log viewer with DataTable (lucide-react ScrollText)                               |
| 13 | ❌      | Add audit log filtering: by action type, entity type, actor, date range                              |
| 14 | ❌      | Add audit log detail view: full change diff (before/after values)                                    |
| 15 | ❌      | Add audit log for admin user management actions (role change, ban/unban)                             |
| 16 | ❌      | Add data retention policy: auto-archive logs older than N days                                       |
| 17 | ❌      | Add GDPR compliance: data anonymization for deleted user audit entries                               |
| 18 | ❌      | Add audit log export as CSV (lucide-react Download)                                                   |
| 19 | ❌      | Add loading skeleton for audit log page                                                               |
| 20 | ❌      | Add empty state for zero audit entries                                                                |
| 21 | ❌      | Add audit log `PageHeader` with filters and export action                                             |
| 22 | ❌      | Add suspicious activity alerts (multiple failed logins, bulk deletions)                               |
| 23 | ❌      | Add order audit trail display on order detail page in Studio                                          |
| 24 | ❌      | Add inventory adjustment audit trail on inventory detail page                                         |
| 25 | ❌      | Add user activity timeline on Studio customer detail page                                              |

---

## Estimated Timeline

| Scope                       | Phases | Duration    | Status                    |
| --------------------------- | ------ | ----------- | ------------------------- |
| **Foundation**              | 1–3    | 2–3 weeks   | ✅ Mostly Done             |
| **Product Catalog**         | 4–10   | 3–4 weeks   | 🟡 Core Done, Polish Left |
| **Account & Commerce APIs** | 11–16  | 3–4 weeks   | 🟡 Partial                |
| **Checkout & Fulfillment**  | 17–19  | 2–3 weeks   | ✅ Core Complete           |
| **Polish & Launch**         | 20–23  | 3–4 weeks   | 🟡 Partial                |
| **Post-MVP**                | 24–26  | 6–8 weeks   | ❌ Not Started             |
| **Enterprise**              | 27–31  | 14–18 weeks | ❌ Not Started             |

**MVP Target: 10–12 weeks total** (foundation done, ~5–7 weeks remaining for UI polish, site pages, SEO, and testing)

---

## Progress Table

| Phase                   | Module                         | Dependencies         | Status                | Completion |
| ----------------------- | ------------------------------ | -------------------- | --------------------- | ---------- |
| 1                       | Foundation & Infrastructure    | —                    | ✅ Complete            | 92%        |
| 2                       | Authentication & Authorization | Phase 1              | ✅ Complete            | 88%        |
| 3                       | Shared UI & Design System      | Phase 1              | 🟡 Partial            | 45%        |
| 4                       | Category Management            | Phase 1, 3           | 🟡 Partial            | 55%        |
| 5                       | Subcategory Management         | Phase 4              | 🟡 Partial            | 45%        |
| 6                       | Series Management              | Phase 5              | 🟡 Partial            | 48%        |
| 7                       | Attribute Management           | Phase 6              | 🟡 Partial            | 50%        |
| 8                       | Product Management             | Phase 4, 5, 6        | 🟡 Partial            | 35%        |
| 9                       | Product Variant                | Phase 8              | 🟡 Partial            | 48%        |
| 10                      | Inventory Management           | Phase 9              | 🟡 Partial            | 50%        |
| 11                      | Account Management             | Phase 2              | 🟡 Partial            | 52%        |
| 12                      | Address Management             | Phase 11             | 🟡 Partial            | 60%        |
| 13                      | Cart                           | Phase 9, 10          | 🟡 Partial            | 42%        |
| 14                      | Wishlist                       | Phase 9              | 🟡 Partial            | 48%        |
| 15                      | Order Management               | Phase 13, 12         | 🟡 Partial            | 35%        |
| 16                      | Payment Processing             | Phase 15             | 🟡 Partial            | 42%        |
| 17                      | Checkout Flow                  | Phase 13, 12, 15, 16 | 🟡 Partial            | 42%        |
| 18                      | Shipment & Fulfillment         | Phase 15             | 🟡 Partial            | 52%        |
| 19                      | Email & Notifications          | Phase 15, 16         | 🟡 Partial            | 52%        |
| 20                      | Legal & Cookies                | Phase 1              | 🟡 Partial            | 35%        |
| 21                      | Site & Marketing Pages         | Phase 8              | 🟡 Partial            | 22%        |
| 22                      | SEO & Production Readiness     | Phase 17, 21         | 🟡 Partial            | 22%        |
| 23                      | Testing Infrastructure         | Phase 17             | ❌ Not Started         | 0%         |
| **MVP Subtotal**        |                                |                      |                       | **~44%**   |
| 24                      | Discount & Coupon System       | Phase 15, 8          | 🟡 Schema Only        | 8%         |
| 25                      | Product Reviews & Ratings      | Phase 8, 15          | 🟡 Schema Only        | 8%         |
| 26                      | Refund Management              | Phase 16, 15         | ❌ Not Started         | 0%         |
| **Post-MVP Subtotal**   |                                |                      |                       | **~5%**    |
| 27                      | Tax Configuration              | Phase 8, 15          | ❌ Not Started         | 0%         |
| 28                      | Product Relationships          | Phase 8              | ❌ Not Started         | 0%         |
| 29                      | Loyalty & Rewards              | Phase 15, 11         | ❌ Not Started         | 0%         |
| 30                      | Analytics & Intelligence       | Phase 13, 8          | ❌ Not Started         | 0%         |
| 31                      | System-Wide Audit Logging      | All                  | ❌ Not Started         | 0%         |
| **Enterprise Subtotal** |                                |                      |                       | **0%**     |

---

## Module Dependency Matrix

> Quick reference showing which modules must be complete before others can start.

| Module                | Requires                      |
| --------------------- | ----------------------------- |
| Category              | Foundation, Shared UI         |
| Subcategory           | Category                      |
| Series                | Subcategory                   |
| Attribute             | Series                        |
| Product               | Category, Subcategory, Series |
| Product Variant       | Product                       |
| Inventory             | Product Variant               |
| Account               | Auth                          |
| Address               | Account                       |
| Cart                  | Product Variant, Inventory    |
| Wishlist              | Product Variant               |
| Order                 | Cart, Address                 |
| Payment               | Order                         |
| Checkout              | Cart, Address, Order, Payment |
| Shipment              | Order                         |
| Email                 | Order, Payment                |
| Discount              | Order, Product                |
| Review                | Product, Order                |
| Refund                | Payment, Order                |
| Tax                   | Product, Order                |
| Product Relationships | Product                       |
| Loyalty               | Order, Account                |
| Analytics             | Cart, Product                 |
| System Audit          | All modules                   |

---

*Updated: 2026-03-06 — Refined from full codebase analysis. Completion percentages reflect total tasks including UI/UX polish requirements.*
