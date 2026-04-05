# Shipment and Inventory Audit Report

Audit date: `2026-03-16`

## Scope

This is a static code audit focused on:

- `src/module/shipment/*`
- `src/module/inventory/*`
- shipment and inventory routes under `src/app/(studio)`, `src/app/(account)`, and `src/app/(store)`

Reference modules reviewed to validate integration assumptions:

- `src/module/order/order.api.ts`
- `src/module/cart/cart.api.ts`
- `src/module/product-variant/product-variant.api.ts`
- `src/module/inventory/warehouse.api.ts`
- `src/shared/config/routes.ts`
- `src/shared/components/layout/sidebar/sidebar.nav-items.tsx`

## Executive Summary

The main inventory problem is architectural: the schema supports warehouse-aware inventory, but the cart, order, and product-variant flows still behave as if there is only one inventory row per variant. That makes reservations, deductions, and warehouse assignment unreliable as soon as more than one warehouse is used.

The main shipment problem is integration drift: the shipment API mostly works, but routing, ownership checks, and UI wiring are inconsistent. Studio shipping routes do not line up with route constants, and customer shipment views are weaker than the studio equivalents.

The UI incompleteness is not random. In both modules, the screens are exposing capabilities that the APIs or route tree do not fully support yet.

## Findings

### 1. High: inventory is modeled as warehouse-aware in the schema, but most integrations still assume one inventory row per variant

What is wrong:

- The data model includes `warehouseId` on `inventory_item` and `inventory_reservation`.
- The runtime flows in cart, order, and product-variant modules usually fetch or mutate inventory by `variantId` only.
- There is no consistent warehouse selection or warehouse-safe stock deduction path.

Evidence:

- `src/core/db/db.schema.ts:412-425` defines `inventoryItem.warehouseId` and a `variantIdWarehouseIdx`.
- `src/module/cart/cart.api.ts:90-114` reserves inventory by the first `inventoryItem` found for `variantId` only.
- `src/module/cart/cart.api.ts:351-354`, `389-395`, `443-446`, and `493-496` release reservations by `variantId` only.
- `src/module/order/order.api.ts:405-410` decrements inventory by `variantId` only.
- `src/module/product-variant/product-variant.api.ts:50-59` creates inventory without `warehouseId`.
- `src/module/product-variant/product-variant.api.ts:205-231` updates inventory by `variantId` only.
- `src/module/inventory/inventory.api.ts:321-322` `getByVariantId` returns the first inventory row for a variant, not a warehouse-specific row.

Reference modules that prove the mismatch:

- `src/module/inventory/inventory.api.ts:19-104` has a warehouse-aware return helper.
- `src/module/inventory/warehouse.api.ts` exists, which means warehouse support is intended.
- `src/module/order/order.schema.ts:52` and `src/module/order/order.api.ts:146-147` already expect warehouse-level order metadata.

Why this is a root problem:

- If a variant exists in multiple warehouses, reservations can hit the wrong row.
- Order placement can subtract stock from every matching row, not the chosen fulfillment row.
- Public and admin inventory lookups become nondeterministic.

UI impact:

- The inventory UI cannot be trusted as a warehouse-aware control surface while the integrations still treat stock as global per variant.

### 2. High: order checkout updates inventory totals directly but does not create inventory movement records or assign a warehouse

What is wrong:

- Checkout decreases `quantity` and `reserved`, but it does not log the sale as an `inventoryAdjustmentEvent`.
- The order model has `warehouseId`, but checkout never sets it.
- A warehouse-aware return helper exists, but it is not connected to any refund or return flow.

Evidence:

- `src/module/order/order.api.ts:363-410` stores shipping provider, method, and zone, but not `warehouseId`.
- `src/module/order/order.api.ts:405-410` directly mutates `inventoryItem.quantity` and `inventoryItem.reserved`.
- `src/module/inventory/inventory.api.ts:19-104` defines `adjustInventoryForReturn` with warehouse, order, and refund context.
- `rg -n "adjustInventoryForReturn" src` only finds the definition in `src/module/inventory/inventory.api.ts`.

Reference modules that show the intended pattern:

- `src/module/inventory/inventory.api.ts:362-417` logs adjustment events on inventory create.
- `src/module/inventory/inventory.api.ts:437-500` logs adjustment events on inventory update.
- `src/module/inventory/inventory.api.ts:554-627` logs adjustment events on manual stock updates.

Why this matters:

- Inventory movement history is incomplete for the most important stock-changing event: order fulfillment.
- Warehouse-level reporting and later return reconciliation are missing key context.
- The order module already exposes warehouse-related filters and summary fields, but checkout never populates them.

UI impact:

- Inventory movement screens can look healthy while silently missing sales-driven stock changes.
- Order screens can filter by warehouse presence even though new orders never set warehouse assignment.

### 3. High: shipment routing is inconsistent, and studio shipment list-to-detail navigation is broken

What is wrong:

- Route constants point shipment detail to `/studio/shipping/shipments/[id]`.
- The actual detail page lives at `/studio/shipping/[shippingId]`.
- There are two shipment list screens: `/studio/shipping` and `/studio/shipping/shipments`.

Evidence:

- `src/shared/config/routes.ts:121-137` defines:
  - `PATH.STUDIO.SHIPPING.ROOT = /studio/shipping`
  - `PATH.STUDIO.SHIPPING.SHIPMENTS = /studio/shipping/shipments`
  - `PATH.STUDIO.SHIPPING.VIEW(id) = /studio/shipping/shipments/${id}`
- `src/module/shipment/shipment.table.config.ts:6` uses `PATH.STUDIO.SHIPPING.VIEW`.
- `src/app/(studio)/studio/shipping/[shippingId]/page.tsx` is the actual detail route.
- `src/app/(studio)/studio/shipping/shipments/page.tsx` is a second list page.

Reference modules that expose the break:

- `src/module/shipment/shipment.columns.tsx` uses the table config route for row navigation.
- `src/shared/components/layout/sidebar/sidebar.nav-items.tsx:134` sends users to `PATH.STUDIO.SHIPPING.SHIPMENTS`.
- `src/app/(studio)/studio/shipping/page.tsx` already renders shipments at the root screen when `view` is unset.

Why this matters:

- Studio shipment rows navigate to a path family that does not have a matching detail page.
- The route tree is redundant and harder to maintain.

UI impact:

- The shipment list experience is inconsistent depending on whether the user enters through `/studio/shipping` or `/studio/shipping/shipments`.

### 4. High: `shipment.getByOrder` does not verify order ownership the way `order.get` does

What is wrong:

- `shipment.getByOrder` is a `customerProcedure`, but it does not verify that the requested order belongs to the current customer.

Evidence:

- `src/module/shipment/shipment.api.ts:294-304` fetches shipments by `orderId` only.
- `src/module/order/order.api.ts:25-49` checks ownership before returning order data to customers.

Reference modules that show the correct pattern:

- `src/module/order/order.api.ts:25-49` is the right ownership gate for customer order access.

Why this matters:

- Any authenticated customer who can guess or obtain another order ID can potentially call the shipment query for that order.

UI impact:

- The current UI calls are mostly constrained by surrounding screens, but the API contract itself is too permissive.

### 5. Medium: the inventory edit UI exposes warehouse editing, but the backend update path ignores it

What is wrong:

- The edit form renders and submits `warehouseId`.
- The update mutation does not write `warehouseId` at all.
- The form shows a `Save Draft` button that has no behavior.

Evidence:

- `src/module/inventory/inventory.component.edit-form.tsx:64`, `:79`, and `:93` pass and render `warehouseId`.
- `src/module/inventory/inventory.component.edit-form.tsx:103` renders `Save Draft`.
- `src/module/inventory/inventory.api.ts:463-471` builds `updateData` without `warehouseId`.
- `src/module/inventory/inventory.api.ts:473` writes only the fields present in `updateData`.

Reference modules that show a better integration pattern:

- `src/module/shipment/components/shipment-form.tsx:38-112` loads provider and method options from the shipping-config module instead of relying on a raw text ID input.

Why this matters:

- Staff can enter a warehouse ID and assume it was saved when it was silently ignored.
- The UI suggests draft support even though the module has no draft concept.

UI impact:

- Inventory editing currently over-promises and under-delivers.

### 6. Medium: inventory routes and sidebar actions expose screens and views that do not exist

What is wrong:

- Inventory list pages advertise an add-inventory route that is not implemented.
- Sidebar items advertise `view=stock` and `view=movements`, but the inventory page does not switch on `view`.

Evidence:

- `src/shared/config/routes.ts:88` defines `/studio/inventory/new`.
- `src/app/(studio)/studio/inventory/page.tsx:63` uses `PATH.STUDIO.INVENTORY.NEW` as the page action.
- `src/module/inventory/inventory.table.tsx:68` uses `/studio/inventory/new` in the empty state.
- There is no `src/app/(studio)/studio/inventory/new/page.tsx`.
- `src/shared/config/routes.ts:96` defines `PATH.STUDIO.INVENTORY.MOVEMENTS = /studio/inventory?view=movements`.
- `src/shared/components/layout/sidebar/sidebar.nav-items.tsx:97-99` links to `?view=stock` and `?view=movements`.
- `src/app/(studio)/studio/inventory/page.tsx` reads search filters, but not `view`.

Reference modules that show the same pattern already solved elsewhere:

- `src/app/(studio)/studio/shipping/page.tsx` actually switches behavior using `view`.

Why this matters:

- The admin information architecture advertises inventory screens that are not real.

UI impact:

- "Add Inventory", "Stock", and "Stock Movements" feel implemented in navigation, but they are not complete screens.

### 7. Medium: warehouse support is isolated, and its own search logic is partially broken

What is wrong:

- Warehouse search uses `exprA ?? exprB` instead of a SQL `or(...)` expression.
- Inventory list types expect warehouse code and name, but inventory queries do not join warehouse data.
- Warehouse list has create and edit screens, but the table itself does not expose an obvious edit action.

Evidence:

- `src/module/inventory/warehouse.api.ts:33` and `:78` use `ilikeLocal(w.name, ...) ?? ilikeLocal(w.code, ...)`.
- `src/module/inventory/inventory.types.ts:15-16` expects `warehouseCode` and `warehouseName`.
- `src/module/inventory/inventory.api.ts:getMany` queries only `inventoryItem`; it does not join `warehouse`.
- `src/module/inventory/warehouse.table.tsx` only defines passive columns (`code`, `name`, `location`, `isActive`) even though edit pages exist under `src/app/(studio)/studio/inventory/warehouses/[warehouseId]/edit/page.tsx`.

Reference modules that show the correct search approach:

- `src/module/inventory/inventory.api.ts:171-178` uses `or(ilike(...), ilike(...))` for SKU and barcode search.

Why this matters:

- Warehouse search is weaker than intended.
- Inventory screens cannot display meaningful warehouse labels even though the type layer expects them.

UI impact:

- Warehouse and inventory UIs feel disconnected rather than part of one stock-management flow.

### 8. Medium: shipment status integration with orders is too coarse for returns and exceptions

What is wrong:

- Shipment status has richer states than order status.
- `exception` and `returned` are both collapsed into `order.status = cancelled`.
- There is no stock-restoration or refund integration when a shipment is returned.

Evidence:

- `src/module/shipment/shipment.api.ts:258-263` maps `exception` and `returned` to `cancelled`.
- `src/module/order/order.schema.ts` only allows `pending`, `paid`, `shipped`, `delivered`, `cancelled`.
- `src/module/inventory/inventory.api.ts:19-104` already has a return-aware stock helper, but it is not called from shipment or refund flows.

Reference modules that show the missing integration:

- Inventory already knows how to record a return adjustment.
- Shipment already knows when something is `returned`.
- The connection between those two modules is missing.

Why this matters:

- Operationally, "returned" is not the same thing as "cancelled".
- Inventory and refund follow-up work has no automatic handoff.

UI impact:

- Order and shipment timelines can diverge from the real business state.

### 9. Medium: customer shipment UI is weaker than the studio shipment UI

What is wrong:

- The account shipment page loads shipments with an N+1 loop over orders.
- Customer shipment cards show raw shipping provider and shipping method IDs.
- A public tracking lookup API exists, but there is no route or screen that uses it.

Evidence:

- `src/app/(account)/account/shipment/page.tsx:18-21` loops through all order IDs and calls `shipment.getByOrder` one order at a time.
- `src/module/shipment/components/shipment-card.tsx:41-50` renders raw `shippingProviderId` and `shippingMethodId`.
- `src/module/shipment/shipment.api.ts:113-126` exposes `getByTracking`.
- `rg -n "getByTracking" src/app src/module` only finds schema, types, and API definitions, not a screen.

Reference modules that show the better pattern:

- `src/module/shipment/shipment.table.tsx` resolves provider and method names from `shippingConfig` before rendering the studio table.

Why this matters:

- Customer shipment UX is slower and less understandable than the staff version.
- The public tracking capability is not surfaced anywhere usable.

UI impact:

- Shipment information looks less complete to customers than it does to staff.

## UI Incompleteness Snapshot

Shipment UI gaps:

- `/studio/shipping` and `/studio/shipping/shipments` duplicate the shipment list concept.
- Shipment list-to-detail navigation is pointed at the wrong path family.
- `/account/shipment` is functional but inefficient and less informative than the studio table.
- There is no public tracking screen for the existing `getByTracking` API.

Inventory UI gaps:

- `/studio/inventory` advertises a create route that does not exist.
- Sidebar inventory views (`stock`, `movements`) are not implemented as distinct screens.
- `/studio/inventory/[inventoryId]/edit-inventory` exposes warehouse editing and draft UI without backend support.
- Inventory detail shows movements, but those movements are incomplete because checkout does not log stock deductions.
- Warehouse CRUD exists, but warehouse selection is not integrated into inventory editing or order allocation.

## What Is Already Reusable

These parts are worth keeping and building around:

- `inventoryAdjustmentEvent` is a good audit model once order and return flows start writing to it consistently.
- `adjustInventoryForReturn` is a strong warehouse-aware helper once refund or return flows are wired.
- `ShipmentTimeline`, `ShipmentStatusForm`, and `ShipmentStatusBadge` are good UI primitives for staff shipment workflows.
- `WarehouseForm` is usable, but inventory editing should consume warehouse data from it instead of raw IDs.

## Bottom Line

The shipment module is not fundamentally broken, but its routing and customer access model are inconsistent.

The inventory module has a deeper problem: warehouse support exists in the schema and some helper code, but the critical integrations with cart, checkout, and product variants still operate like a single-row-per-variant system. Until that mismatch is resolved, the inventory UI will continue to look more complete than the underlying behavior really is.
