# Image Management System

> Complete audit of how images are uploaded, stored, displayed, and managed across the e-commerce platform.
> Covers current state, bugs, security gaps, and a feature roadmap for image picker, gallery, multi-upload, avatar, and cover image support.

---

## Table of Contents

- [1. Current Architecture](#1-current-architecture)
  - [1.1 Upload Pipeline](#11-upload-pipeline)
  - [1.2 Form Field Component](#12-form-field-component)
  - [1.3 Upload Hook](#13-upload-hook)
  - [1.4 Server Endpoint](#14-server-endpoint)
  - [1.5 Image Display Layer](#15-image-display-layer)
- [2. Where Images Are Consumed](#2-where-images-are-consumed)
  - [2.1 Database Schema](#21-database-schema)
  - [2.2 Form Usage Map](#22-form-usage-map)
  - [2.3 Display Locations](#23-display-locations)
- [3. Issues & Bugs](#3-issues--bugs)
  - [3.1 Critical / Security](#31-critical--security)
  - [3.2 Functional Bugs](#32-functional-bugs)
  - [3.3 Architecture / Data](#33-architecture--data)
- [4. Feature Roadmap](#4-feature-roadmap)
  - [4.1 New Field Types](#41-new-field-types)
  - [4.2 Image Picker / Gallery Dialog](#42-image-picker--gallery-dialog)
  - [4.3 Centralized Media Management](#43-centralized-media-management)
  - [4.4 User Avatar Upload](#44-user-avatar-upload)
  - [4.5 Cover Image Field](#45-cover-image-field)
  - [4.6 Secure Upload Endpoint](#46-secure-upload-endpoint)
- [5. Implementation Guidelines](#5-implementation-guidelines)
  - [5.1 Form System Conventions](#51-form-system-conventions)
  - [5.2 Schema Conventions](#52-schema-conventions)
  - [5.3 Upload Conventions](#53-upload-conventions)
  - [5.4 Component Conventions](#54-component-conventions)
- [6. File Reference](#6-file-reference)

---

## 1. Current Architecture

### 1.1 Upload Pipeline

The image upload flow is a three-layer system:

```
User selects file → useFileUpload hook (local state + preview)
                  → Click "Upload" button
                  → POST /api/blob/upload (FormData)
                  → @vercel/blob put() → returns { url, pathname }
                  → field.onChange(url) → React Hook Form stores URL string
```

Key characteristic: **upload is a separate manual step**. Selecting a file only creates a local preview via `URL.createObjectURL()`. The form value remains empty until the user explicitly clicks "Upload".

### 1.2 Form Field Component

**File:** `src/shared/components/form/fields/field.image-upload.tsx`
**Exported as:** `ImageUploadText`
**Registered as:** `type: "image"` in `src/shared/components/form/fields.config.tsx`

Responsibilities:
- Renders drag-and-drop zone with `BlurImage` preview
- Integrates `useFileUpload` hook for file selection and local state
- Provides "Upload" button that calls `uploadFirst()` and stores returned URL in RHF
- Provides "Remove" button that clears the form field value
- Shows upload status indicator (green dot = uploaded, gray = not uploaded)
- Shows fake progress bar during upload (broken — see issues)

The form value (`field.value`) is always a **string URL** (or empty string). The actual `File` object lives only in the hook's internal state.

### 1.3 Upload Hook

**File:** `src/shared/utils/hooks/use-file-upload.ts`
**Export:** `useFileUpload(options)`

Returns `[FileUploadState, FileUploadActions]`:

| State | Type | Purpose |
|-------|------|---------|
| `files` | `FileWithPreview[]` | Selected files with local preview URLs |
| `isDragging` | `boolean` | Drag-over state |
| `errors` | `string[]` | Validation error messages |

| Action | Purpose |
|--------|---------|
| `addFiles` | Validate and add files to local state |
| `removeFile` | Remove a file by ID, revoke object URL |
| `uploadFirst` | POST first file to `/api/blob/upload`, return `{ url, pathname }` |
| `clearFiles` | Remove all files, revoke all object URLs |
| `clearErrors` | Clear validation errors |
| `handleDragEnter/Leave/Over/Drop` | Drag-and-drop event handlers |
| `openFileDialog` | Programmatically click the hidden file input |
| `getInputProps` | Returns props for the hidden `<input type="file">` |

Client-side validation:
- `maxSize` — file size in bytes (default: 5MB from the field component)
- `accept` — MIME pattern (hardcoded to `"image/*"` from the field component)
- Duplicate detection (in multiple mode only)

### 1.4 Server Endpoint

**File:** `src/app/api/blob/upload/route.ts`

```ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  const uploaded = await put(file.name, file, { access: "public" });
  return NextResponse.json({ url: uploaded.url, pathname: uploaded.pathname }, { status: 200 });
}
```

- Uses `@vercel/blob` v2.0.0
- Files stored as **public** blobs
- Blob key = original `file.name`
- No authentication, no validation, no rate limiting

### 1.5 Image Display Layer

**`BlurImage`** — `src/shared/components/ui/image.tsx`
- Wrapper around `next/image` with loading shimmer, error fallback, and `normalizeSrc()`
- Used across all product, category, variant, and form preview rendering

**`getImageSrc()`** — `src/shared/utils/lib/image.utils.ts`
- Sanitizes nullable/undefined image strings
- Returns `undefined` for empty, `"undefined"`, or `"null"` strings

**`PLACEHOLDER_IMAGE`** — `"/fallback.svg"` in `public/`

**`next.config.ts` remote patterns:**
- `*.public.blob.vercel-storage.com` (Vercel Blob)
- `lh3.googleusercontent.com` (Google OAuth)
- `avatars.githubusercontent.com` (GitHub OAuth)
- `api.dicebear.com` (DiceBear fallback avatars)
- `images.unsplash.com` (Static content)

---

## 2. Where Images Are Consumed

### 2.1 Database Schema

**File:** `src/core/db/db.schema.ts`

| Table | Column(s) | Type | Notes |
|-------|-----------|------|-------|
| `user` | `image` | `text` (nullable) | Avatar from OAuth; no upload UI |
| `category` | `image`, `icon` | `text` (nullable each) | Only `image` has form field; `icon` has no UI |
| `subcategory` | `image`, `icon` | `text` (nullable each) | Only `image` has form field; `icon` has no UI |
| `series` | `image`, `icon` | `text` (nullable each) | Only `image` has form field; `icon` has no UI |
| `product` | `baseImage` | `text` (nullable) | Single image per product |
| `productVariant` | `media` | `json` — `{ url: string }[]` | Array of media URLs stored inline |
| `media` | `id`, `url`, `alt`, `type` | Dedicated table | **UNUSED** — never written to or queried |

**`media` table definition (unused):**
```sql
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  type TEXT DEFAULT 'image',  -- 'image' | 'video' | 'model' | 'file'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`imageTypeEnum`** — `src/shared/schema/enums.schema.ts`
```ts
export const imageTypeEnum = z.enum(["main", "thumbnail", "gallery", "variant"]);
```
Also unused — defined but never referenced by any form or API.

### 2.2 Form Usage Map

| Entity | Form File(s) | Field Name | Field Type | Default Value |
|--------|-------------|------------|------------|---------------|
| **Category** | `category.component.form.tsx`, `category.component.edit-form.tsx` | `body.image` | `"image"` | `""` |
| **Subcategory** | `subcategory-form.tsx` | `body.image` | `"image"` | `""` |
| **Series** | `series-form.tsx` | `body.image` | `"image"` | `""` |
| **Product** | `product-form.tsx`, `product-edit-form.tsx` | `body.baseImage` | `"image"` | `""` |
| **Product Variant** | `product-variant-add-form.tsx`, `product-variant-edit-form.tsx` | `body.media.N.url` | `"image"` (via FormGroup) | `[{ url: "" }]` |
| **User Profile** | `account.profile.tsx` | — | **None** | N/A |

**Pattern for single image (category, series, subcategory, product):**
```tsx
<FormSection title="Media" description="Upload images">
  <Form.Field name="body.image" label="Featured Image" type="image" />
</FormSection>
```

**Pattern for multi-image (product variant):**
```tsx
<Form.FormGroup name="body.media">
  {({ index, add, remove, length }) => (
    <FormItem>
      <Form.Field name={`body.media.${index}.url`} type="image" />
      <Button onClick={() => remove(index)}>  {/* Remove */}
      <Button onClick={() => add({ url: "" })}> {/* Add */}
    </FormItem>
  )}
</Form.FormGroup>
```

### 2.3 Display Locations

**Storefront:**
- `product-card.tsx` — `product.baseImage`
- `product-pdp.tsx` — `selectedVariant.media[0].url` or `product.baseImage`
- `product-series-cards.tsx` — `product.variant.media[0].url`
- `product-variant-card.tsx` — `variant.media[0].url`
- `category.shop-by.tsx`, `category.banner.tsx`, `category.component.card.tsx` — `category.image`
- `subcategory-card.tsx`, `subcategory-listing.tsx` — `subcategory.image`, `series.image`

**User avatar:**
- `nav-user.tsx` — `Avatar` + `AvatarImage` with `user.image`, fallback to initials
- `component.user.profile.tsx` — `Image` with `user.image`, fallback to DiceBear identicon
- `user-management.actions.ts` — passes `user.image` to admin views

**OG/meta images:**
- `[variantSlug]/page.tsx` — `getImageSrc(data.product.baseImage)` used in `openGraph.image`

---

## 3. Issues & Bugs

### 3.1 Critical / Security

| # | Issue | File | Severity |
|---|-------|------|----------|
| S1 | **No auth on upload endpoint** — anyone can POST files to Vercel Blob storage | `src/app/api/blob/upload/route.ts` | CRITICAL |
| S2 | **No server-side file validation** — no size cap, no MIME check, no magic-byte sniffing. Client checks are bypassable | `src/app/api/blob/upload/route.ts` | CRITICAL |
| S3 | **No rate limiting** — endpoint open for abuse/DoS | `src/app/api/blob/upload/route.ts` | HIGH |
| S4 | **Public blob access** — `{ access: "public" }` means all uploaded files are world-readable forever | `src/app/api/blob/upload/route.ts` L10 | MEDIUM |

### 3.2 Functional Bugs

| # | Issue | File | Line(s) |
|---|-------|------|---------|
| B1 | **Fake progress breaks immediately** — `tick()` closure captures stale `isUploading` (still `false`), so `requestAnimationFrame(tick)` runs once and stops | `field.image-upload.tsx` | L133-136 |
| B2 | **Preview doesn't update when replacing** — `src` prioritizes `field.value` (old URL) over `files[0]?.preview` (new file). Must "Remove" old image before new preview shows | `field.image-upload.tsx` | L80 |
| B3 | **"Forgot to upload" trap** — selecting a file does NOT auto-upload or set the form value. Form can be submitted with `url: ""` despite a file being visually shown in preview | `field.image-upload.tsx` | entire component |
| B4 | **Unused variable** — `previewUrlFromForm` declared as `undefined` on L42, never used | `field.image-upload.tsx` | L42 |
| B5 | **`uploadFirst` stale closure** — depends on `state.files` but may reference a stale snapshot if files change between selection and clicking Upload | `use-file-upload.ts` | L272-281 |
| B6 | **Variant media requires `z.string().url()` but default is `{ url: "" }`** — form starts in invalid state for media fields, causing confusing validation errors | `product-variant.schema.ts` | L48 |

### 3.3 Architecture / Data

| # | Issue | Impact |
|---|-------|--------|
| A1 | **Orphaned blobs** — "Remove" clears form URL but does NOT delete the blob from Vercel storage. Repeated uploads accumulate orphaned files (cost + clutter) | Storage cost grows unbounded |
| A2 | **Filename collisions** — `put(file.name, ...)` uses original filename as blob key. Multiple users uploading `photo.jpg` can collide | Data corruption risk |
| A3 | **No tenant/entity scoping** — all uploads in flat namespace. No way to clean up images for a deleted product/variant | Unmanageable storage |
| A4 | **`media` table is dead** — defined in DB schema but never written to or queried. Variant media is inline JSON, other entities store plain text URL | No centralized media registry |
| A5 | **Inconsistent validation** — variant: `z.string().url()` vs category/series/product: `z.string().nullable()` (accepts any string) | Schema drift |
| A6 | **No `icon` upload field** — category, subcategory, series all have `icon` column in DB but no form field to set them | Dead columns |
| A7 | **No user avatar upload** — `account.profile.tsx` only has name/email. `user.image` can only be set via OAuth | Missing feature |
| A8 | **`imageTypeEnum` unused** — defined in `enums.schema.ts` but never used anywhere | Dead code |
| A9 | **No `alt` text** — variant media schema is `{ url: string }` only. No alt text for accessibility/SEO | Accessibility gap |

---

## 4. Feature Roadmap

### 4.1 New Field Types

Add to `form.types.ts` and `fields.config.tsx`:

**`type: "imageMulti"`** — Multi-image upload in a single field

```ts
export interface ImageMultiInputProps extends BaseFormInputProps {
  type: "imageMulti";
  maxSizeMB?: number;
  maxFiles?: number;
  showGalleryPicker?: boolean;  // enable "Browse Library" button
}
```

- Replaces the current FormGroup + individual image fields pattern for variant media
- Renders a grid of thumbnails with drag-to-reorder
- Each image has remove (X) button
- "Add more" button at the end
- Form value: `{ url: string; alt?: string }[]`
- Auto-uploads on file selection (no separate Upload button)

**`type: "avatar"`** — Circular avatar upload

```ts
export interface AvatarInputProps extends BaseFormInputProps {
  type: "avatar";
  maxSizeMB?: number;
  size?: "sm" | "md" | "lg";  // 64px, 96px, 128px
}
```

- Circular crop preview
- Click to change, hover overlay with camera icon
- Auto-upload on selection
- Form value: `string` (URL)

**`type: "coverImage"`** — Wide aspect-ratio banner upload

```ts
export interface CoverImageInputProps extends BaseFormInputProps {
  type: "coverImage";
  maxSizeMB?: number;
  aspectRatio?: string;  // default "16/5"
}
```

- Wide aspect-ratio preview matching the target display ratio
- Overlay edit button
- Auto-upload on selection
- Form value: `string` (URL)

### 4.2 Image Picker / Gallery Dialog

**New component:** `src/shared/components/media/image-picker-dialog.tsx`

Purpose: Allow users to reuse previously uploaded images instead of re-uploading.

Behavior:
- Opens as a Dialog/Sheet from any image field via a "Browse Library" button
- Queries the `media` table for existing uploads (filtered by `type` from `imageTypeEnum`)
- Grid layout with search and type filter
- Click an image to select → inserts its URL into the form field
- Pagination or infinite scroll for large libraries

Integration point: Every image field component (`ImageUploadText`, `ImageMultiUpload`, `AvatarUpload`, `CoverImageUpload`) should have an optional "Browse Library" button that opens this dialog.

### 4.3 Centralized Media Management

**Activate the `media` table** — every upload should create a row:

```ts
// New tRPC router: src/module/media/media.api.ts
media.upload   // POST: upload file → blob + insert media row → return { id, url, alt, type }
media.list     // GET:  paginated list with type filter
media.delete   // DELETE: del() blob + remove media row
media.update   // PATCH: update alt text, type
media.getById  // GET: single media item
```

**Upload flow change:**
```
Current:  Field → hook → POST /api/blob/upload → raw blob URL → form value
Proposed: Field → hook → tRPC media.upload → blob + media row → { id, url } → form value
```

**Deletion flow:**
```
Current:  field.onChange("") — blob is orphaned
Proposed: field.onChange("") + tRPC media.delete(id) — blob deleted, row removed
```

### 4.4 User Avatar Upload

**Where:** `src/module/account/account.profile.tsx`

Current state: Only `name` and `email` fields. No image upload.

Required changes:
1. Add `type: "avatar"` field to the profile form
2. On upload completion, call Better Auth's `updateUser({ image: url })`
3. Avatar preview above the name/email fields
4. Fallback chain: uploaded image → OAuth avatar → DiceBear identicon

```tsx
// Proposed profile form structure
<Form schema={profileSchema} ...>
  <Form.Field name="image" type="avatar" label="Profile Photo" />
  <Form.Field name="name" type="text" label="Name" />
  <Form.Field name="email" type="text" label="Email" />
</Form>
```

Better Auth already exports `updateUser` in `auth.client.ts` which supports setting `image`.

### 4.5 Cover Image Field

Potential uses:
- Category hero/banner image (currently `category.image` but displayed at full width)
- Store homepage hero section
- User profile cover/banner (if added later)

The `type: "coverImage"` field provides a wide aspect-ratio upload area that matches the actual display dimensions, giving a WYSIWYG editing experience.

### 4.6 Secure Upload Endpoint

Replace the current bare `/api/blob/upload` with a secured version:

```ts
// src/app/api/blob/upload/route.ts — proposed
export async function POST(request: Request) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Rate limit (10 uploads/min/user)
  const limited = await rateLimit(session.user.id, { max: 10, window: 60 });
  if (limited) return NextResponse.json({ error: "Too many uploads" }, { status: 429 });

  // 3. Parse and validate
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "File too large (10MB max)" }, { status: 413 });

  // 4. MIME validation (allowlist)
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowed.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 415 });

  // 5. Upload with scoped key
  const key = `images/${session.user.id}/${uuidv4()}-${sanitizeFilename(file.name)}`;
  const uploaded = await put(key, file, { access: "public" });

  // 6. Insert media row
  const mediaId = uuidv4();
  await db.insert(media).values({
    id: mediaId,
    url: uploaded.url,
    alt: null,
    type: "image",
  });

  return NextResponse.json({ id: mediaId, url: uploaded.url, pathname: uploaded.pathname });
}
```

---

## 5. Implementation Guidelines

### 5.1 Form System Conventions

Every new field type must follow the existing pattern:

1. **Define the interface** in `src/shared/components/form/form.types.ts`:
   - Extend `BaseFormInputProps`
   - Add type-specific props (e.g. `maxFiles`, `aspectRatio`)
   - Add to the `FormInputProps` union type

2. **Create the component** in `src/shared/components/form/fields/field.<name>.tsx`:
   - Use `useFormContext()` to access RHF
   - Wrap in `<FormField>` → `<FormItem>` → `<FormControl>` → `<FormLabel>` → `<FormMessage>`
   - Guard with `if (props.type !== "xxx") return null`
   - Handle `props.hidden`, `props.required`, `props.readonly`

3. **Register in `fields.config.tsx`**:
   ```ts
   imageMulti: dynamic(() => import("./fields/field.image-multi").then((mod) => mod.ImageMultiUpload), {
     ssr: false,
     loading: () => loadingImageSkeleton(),
   }),
   ```

4. **In consuming forms**, always use `<FormSection>` wrapper:
   ```tsx
   <FormSection title="Media" description="Upload images">
     <Form.Field name="body.images" type="imageMulti" maxFiles={10} />
   </FormSection>
   ```

### 5.2 Schema Conventions

**Standardize image URL validation across all modules:**

```ts
// Proposed: src/shared/schema/image.schema.ts

/** Single image URL — use for category.image, series.image, product.baseImage, user.image */
export const imageUrlSchema = z.string().url().nullable().optional();

/** Media item with alt text — use for variant media arrays */
export const mediaItemSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional().default(""),
});

/** Media array — use for product variant media */
export const mediaArraySchema = z.array(mediaItemSchema).nullable().default([]);
```

**Current inconsistencies to fix:**

| Module | Current | Should Be |
|--------|---------|-----------|
| Category | `z.string().nullable().optional()` | `imageUrlSchema` |
| Subcategory | `z.string().nullable().optional()` | `imageUrlSchema` |
| Series | `z.string().nullable()` | `imageUrlSchema` |
| Product | `z.string().nullable().optional()` | `imageUrlSchema` |
| Product Variant media | `z.object({ url: z.string().url() })` | `mediaItemSchema` (add `alt`) |

### 5.3 Upload Conventions

1. **Auto-upload on file selection** — remove the separate "Upload" button. As soon as a file is selected or dropped, begin uploading immediately. Show a progress indicator during upload. Set the form value when complete.

2. **Every upload → `media` table row** — centralize all uploaded files in the `media` table for gallery/picker/cleanup.

3. **Every delete → blob + row removal** — when user removes an image, call `del(url)` from `@vercel/blob` AND delete the `media` row.

4. **Scoped blob keys** — `images/{userId}/{uuid}-{sanitizedFilename}` to prevent collisions and enable per-user cleanup.

5. **Server-side validation always** — never trust client-side checks:
   - Max size: 10MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`
   - Auth required
   - Rate limited

### 5.4 Component Conventions

1. **Use `BlurImage`** (not raw `next/image`) for all image rendering in form previews and display components.

2. **Use `getImageSrc()` + `PLACEHOLDER_IMAGE`** for safe fallback chains.

3. **Use `cn()`** from `src/shared/utils/lib/utils` for conditional Tailwind classes.

4. **Lazy-load** all field components with `next/dynamic({ ssr: false })` and provide skeleton loading states.

5. **Use `sonner` `toast`** for upload success/error notifications (consistent with all other forms).

6. **Use existing UI primitives** — `Button`, `Dialog`, `Skeleton`, `Badge`, `Avatar`, `Card` from `src/shared/components/ui/`.

---

## 6. File Reference

### Core Files

| File | Purpose |
|------|---------|
| `src/shared/components/form/fields/field.image-upload.tsx` | Current `type: "image"` form field |
| `src/shared/utils/hooks/use-file-upload.ts` | File upload hook (local state, validation, upload) |
| `src/app/api/blob/upload/route.ts` | Server upload endpoint (Vercel Blob) |
| `src/shared/components/ui/image.tsx` | `BlurImage` display component |
| `src/shared/utils/lib/image.utils.ts` | `getImageSrc()`, `PLACEHOLDER_IMAGE` |
| `src/shared/schema/enums.schema.ts` | `imageTypeEnum` (unused) |
| `src/core/db/db.schema.ts` | All DB tables with image columns + `media` table |

### Form System Files

| File | Purpose |
|------|---------|
| `src/shared/components/form/form.tsx` | Main `Form` component + `Form.Field`, `Form.FormGroup`, etc. |
| `src/shared/components/form/form.types.ts` | `FormInputProps` union, `ImageInputProps`, `BaseFormInputProps` |
| `src/shared/components/form/form.helper.tsx` | `FormSection` layout component |
| `src/shared/components/form/fields.config.tsx` | Field type → component mapping |

### Forms That Use Image Upload

| File | Entity | Image Field |
|------|--------|-------------|
| `src/module/category/category.component.form.tsx` | Category (create) | `body.image` |
| `src/module/category/category.component.edit-form.tsx` | Category (edit) | `body.image` |
| `src/module/subcategory/subcategory-form.tsx` | Subcategory | `body.image` |
| `src/module/series/series-form.tsx` | Series | `body.image` |
| `src/module/product/product-form.tsx` | Product (create) | `body.baseImage` |
| `src/module/product/product-edit-form.tsx` | Product (edit) | `body.baseImage` |
| `src/module/product-variant/product-variant-add-form.tsx` | Variant (create) | `body.media.N.url` |
| `src/module/product-variant/product-variant-edit-form.tsx` | Variant (edit) | `body.media.N.url` |
| `src/module/account/account.profile.tsx` | User profile | **None (needs avatar)** |

### Display Components That Render Images

| File | What It Shows |
|------|---------------|
| `src/module/product/product-card.tsx` | Product base image |
| `src/module/product/product-pdp.tsx` | Variant media or product base image |
| `src/module/product/product-series-cards.tsx` | First variant media |
| `src/module/product-variant/product-variant-card.tsx` | First variant media |
| `src/module/category/category.shop-by.tsx` | Category image |
| `src/module/category/category.banner.tsx` | Category image |
| `src/module/category/category.component.card.tsx` | Category image |
| `src/module/subcategory/subcategory-card.tsx` | Subcategory image |
| `src/module/subcategory/subcategory-listing.tsx` | Series image |
| `src/module/cart/components/cart-item.tsx` | Cart item image |
| `src/module/wishlist/components/wishlist-item.tsx` | Product base image |
| `src/module/checkout/components/cart-review-section.tsx` | Cart item image |
| `src/shared/components/layout/user/nav-user.tsx` | User avatar |
| `src/module/user/component.user.profile.tsx` | User avatar |

---

> **Next steps:** Address S1-S3 (security) first, then fix B1-B3 (functional bugs), then implement features from Section 4 in priority order: 4.6 (secure endpoint) → 4.3 (media management) → 4.1 (new field types) → 4.4 (avatar) → 4.2 (gallery picker) → 4.5 (cover image).
