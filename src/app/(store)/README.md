# Store UI Documentation

This directory contains the storefront application logic and UI. The UI is built to dynamically reflect the data models defined in the core database schema.

## 🏗️ Schema-Driven UI Architecture

The Store UI is designed to align with the canonical Drizzle schema found in `src/core/db/db.schema.ts`.

### 1. Catalog Hierarchy
The navigation and browsing experience follows the database hierarchy:
- **`category`**: Top-level grouping (e.g., Electronics, Fashion).
- **`subcategory`**: Nested grouping within categories (e.g., Laptops, Men's Wear).
- **`series`**: Product lines or collections within subcategories.
- **`product`**: The base product definition.
- **`product_variant`**: The actual purchasable items with specific attributes (color, size, etc.).

**Mapping to Routes:**
- `/store` -> Lists all categories and featured subcategories.
- `/store/[categorySlug]` -> Lists subcategories within a category.
- `/store/[categorySlug]/[subCategorySlug]` -> Lists series/products within a subcategory.
- `/store/[categorySlug]/[subCategorySlug]/[seriesSlug]` -> Lists products/variants within a series.
- `/store/[categorySlug]/[subCategorySlug]/[seriesSlug]/[variantSlug]` -> Product Detail Page (PDP).

### 2. Commerce & User Data
- **`cart` & `cart_line`**: Managed via the cart drawer and checkout flow.
- **`wishlist`**: Accessible from product cards and a dedicated wishlist page.
- **`order` & `order_item`**: Reflected in the order history and tracking pages.
- **`address`**: Managed in the user account and during checkout.
- **`review`**: Displayed on the PDP to show user feedback.

---

## 🧩 UI Building Blocks

We use a modular approach to building the UI, categorized into three levels:

### 1. Elements (Atoms)
Basic UI components located in `src/shared/components/ui`. These are primarily based on **shadcn/ui**.
- **Usage**: Buttons, Inputs, Badges, Tooltips, etc.
- **Example**: `<Button variant="outline">View All</Button>`

### 2. Blocks / Modules (Molecules & Organisms)
Complex, domain-specific components located in `src/module/[module-name]/components`.
- **Usage**: `cart-item`, `address-card`, `order-timeline`, `product-card`.
- **Example**: `<CartItem data={line} />`

### 3. Layout Blocks
Structural components used to wrap content and ensure consistency.
- **`Shell`**: The main page wrapper (`src/shared/components/layout/shell`).
- **`Section`**: A semantic content section with title, description, and action button (`src/shared/components/layout/section/section.tsx`).

---

## 🚀 How to Extend the UI

### Adding a New UI Element
1. Create a new component in `src/shared/components/ui/`.
2. Follow the shadcn/ui pattern (Radix UI primitives + Tailwind CSS).

### Adding a New Module Block
1. If it's specific to a domain (e.g., "Loyalty"), create a folder `src/module/loyalty/components/`.
2. Implement your component (e.g., `loyalty-card.tsx`).
3. Use `apiClient` or `apiServer` to fetch data from the corresponding schema table.

### Creating a New Store Page
1. Add a new route in `src/app/(store)/store/`.
2. Wrap your page content in `<Shell>` and `<Shell.Section>`.
3. Use `<Section>` to group related UI elements.

```tsx
import Shell from "@/shared/components/layout/shell";
import Section from "@/shared/components/layout/section/section";

export default function NewPage() {
  return (
    <Shell>
      <Shell.Section>
        <Section title="New Section" description="Description of the section">
          {/* Your UI blocks here */}
        </Section>
      </Shell.Section>
    </Shell>
  );
}
```

---

## 🎨 Design Conventions
- **Tailwind CSS**: Use utility classes for styling.
- **View Transitions**: Handled by `ViewTransitionProvider` for smooth navigation.
- **Image Optimization**: Use `BlurImage` and `getImageSrc` utility for efficient image loading.
- **Responsive Design**: Ensure blocks are grid-aware (e.g., `grid-cols-1 md:grid-cols-3`).
