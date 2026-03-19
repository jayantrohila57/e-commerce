# Commerce Business Logic Audit Report

Audit date: `2026-03-17`

## Scope

This report audits the current business logic for:

- Shipping
- Inventory
- Orders
- Payments

It focuses on:

- Customer-facing flows
- Admin/studio-facing flows
- API logic
- UI behavior
- Integration points where modules are not connected correctly

Primary source areas reviewed:

- `src/module/order/*`
- `src/module/payment/*`
- `src/module/shipment/*`
- `src/module/inventory/*`
- `src/module/cart/*`
- `src/module/checkout/*`
- `src/module/shipping-config/*`
- account/store/studio routes under `src/app/*`

## Executive Summary

The current system has the right broad module structure, but the business logic is not connected safely end to end.

The most serious problem is that the order is treated as finalized before payment is actually secured. Inventory is deducted, the cart is cleared, and discount usage is consumed during `order.create`, before Razorpay confirmation succeeds. If payment fails or the customer abandons checkout, the system can still leave reduced stock, consumed discount capacity, and a pending unpaid order behind.

The second major issue is that pricing logic is inconsistent across cart, checkout, order, and payment modules. The database stores money in the smallest currency unit, but several UI surfaces display those values as if they are full rupees. Checkout also shows estimated tax and free shipping logic that does not match the server-side order calculation.

The third major issue is access control and state consistency. Ownership checks are incomplete in some customer APIs, staff/admin boundaries are inconsistent in studio pages, and order/payment/shipment states can be changed in ways that do not reflect real business rules.

Warehouse-aware inventory exists in the schema and partially in the APIs, but the full cart -> checkout -> shipment chain still behaves inconsistently when warehouses matter.

## Findings

### 1. Critical: orders are finalized before payment is secured

What the system does now:

- Checkout creates the order first.
- During order creation, it:
  - inserts the order
  - inserts order items
  - applies discount usage
  - deducts inventory
  - clears the cart
- Only after that does the client create a Razorpay payment intent.
- Only after that does the client confirm the payment.

Why this is wrong:

- The business event order is backwards.
- Inventory and discount consumption should happen only after successful payment, or the system must have a reliable rollback/recovery mechanism.
- The current code has no recovery path for abandoned checkout or failed payment after order creation.

What breaks:

- A failed payment can still reduce stock.
- The cart can disappear even though payment was never completed.
- Discount usage can be incremented even though no successful purchase happened.
- Admin sees pending orders that already affected stock.

Customer impact:

- Customer can lose the cart after a payment failure.
- Product may appear out of stock for later customers even though nobody paid.
- Checkout totals and order lifecycle feel unreliable.

Admin impact:

- Staff can see unpaid orders that already consumed inventory.
- Stock counts become operationally misleading.
- Discount reporting becomes inflated.

Evidence:

- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:189)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:350)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:399)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:424)
- [use-checkout.ts](/d:/Repositories/template/e-commerce/src/module/checkout/use-checkout.ts:67)
- [payment.api.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.api.ts:74)
- [payment.api.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.api.ts:143)
- [route.ts](/d:/Repositories/template/e-commerce/src/app/api/webhooks/razorpay/route.ts:110)

### 2. Critical: payment confirmation is not safe for non-Razorpay providers

What the system does now:

- Payment providers supported in schema/UI are `stripe`, `razorpay`, `paypal`, and `cod`.
- Only Razorpay gets signature verification in `payment.confirm`.
- For other providers, the API accepts the incoming status and updates the order to `paid` if status is `completed`.

Why this is wrong:

- The API contract is broader than the implemented verification.
- That means the system is effectively trusting the client for non-Razorpay completion.

What breaks:

- A user can potentially mark an order as paid for non-Razorpay providers without real provider confirmation.
- Payment records can claim successful capture without any real external proof.

Customer impact:

- Exposed mostly at API level, not through current checkout UI.
- Still a real business/security risk.

Admin impact:

- Payment table can show successful transactions that were never actually settled.
- Orders can move into fulfillment without real payment.

Evidence:

- [payment.schema.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.schema.ts:4)
- [payment.api.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.api.ts:74)
- [payment.api.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.api.ts:143)
- [payment.table.tsx](/d:/Repositories/template/e-commerce/src/module/payment/payment.table.tsx:24)

### 3. Critical: ownership and access control checks are inconsistent

What the system does now:

- `customerProcedure` allows roles `admin`, `staff`, `user`, and `customer`.
- Some order and shipment handlers only enforce ownership when the role is exactly `customer`.
- `payment.getStatus` does not verify that the requested order belongs to the current user.

Why this is wrong:

- The code mixes "authenticated user" and "customer-owned resource" concepts.
- Ownership rules should apply to all non-staff/non-admin roles, not only one normalized role branch.

What breaks:

- A logged-in user with role `user` may access other users' orders or shipments if they know IDs.
- Any authenticated user can query payment rows for any `orderId`.

Customer impact:

- Privacy and data exposure risk.
- Payment and order information can leak across accounts.

Admin impact:

- Trust boundary between customer and staff APIs is not clean.

Evidence:

- [auth.roles.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.roles.ts:28)
- [api.methods.ts](/d:/Repositories/template/e-commerce/src/core/api/api.methods.ts:79)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:33)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:69)
- [shipment.api.ts](/d:/Repositories/template/e-commerce/src/module/shipment/shipment.api.ts:340)
- [payment.api.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.api.ts:224)

### 4. Critical: totals are inconsistent across cart, checkout, order, and payment

What the system does now:

- DB money fields are stored in smallest currency unit.
- Payment/admin pages often divide by 100 correctly.
- Cart, checkout, and several order UI components render raw integer values directly as rupees.
- Checkout summary hardcodes:
  - shipping = `0`
  - tax = `18%`
  - discount amount = `0`
- Server-side order creation writes shipping total from shipping rules but does not populate `taxTotal`.

Why this is wrong:

- There is no single source of truth for displayed totals.
- The user can see one total before payment and a different business total in storage.

What breaks:

- Customer-facing totals are misleading.
- Admin and customer views can disagree on the same order.
- Payment amount may be right while checkout summary is wrong.

Customer impact:

- Loss of trust at checkout.
- Incorrect displayed money values.

Admin impact:

- Order review screens can misrepresent amounts.
- Payment data looks inconsistent relative to order screens.

Evidence:

- [db.schema.ts](/d:/Repositories/template/e-commerce/src/core/db/db.schema.ts:27)
- [cart-summary.tsx](/d:/Repositories/template/e-commerce/src/module/cart/components/cart-summary.tsx:16)
- [cart-item.tsx](/d:/Repositories/template/e-commerce/src/module/cart/components/cart-item.tsx:89)
- [checkout-summary.tsx](/d:/Repositories/template/e-commerce/src/module/checkout/components/checkout-summary.tsx:24)
- [cart-review-section.tsx](/d:/Repositories/template/e-commerce/src/module/checkout/components/cart-review-section.tsx:36)
- [order-summary.tsx](/d:/Repositories/template/e-commerce/src/module/order/components/order-summary.tsx:12)
- [order-card.tsx](/d:/Repositories/template/e-commerce/src/module/order/components/order-card.tsx:37)
- [order-overview-card.tsx](/d:/Repositories/template/e-commerce/src/module/order/components/order-overview-card.tsx:37)
- [payment-overview-card.tsx](/d:/Repositories/template/e-commerce/src/module/payment/components/payment-overview-card.tsx:26)

### 5. High: checkout shipping quote logic and order pricing logic are not the same

What the system does now:

- Checkout loads shipping options through `shippingConfig.getOptions`, which resolves a shipping zone first and then returns rate rules for that zone.
- `order.create` independently validates the chosen method/provider and then searches rate rows itself.
- `order.create` does not use the shipping option result already shown to the customer.
- `freeShippingMinOrderValue` exists in schema but is not used in checkout/order pricing.

Why this is wrong:

- The displayed shipping price and persisted order shipping price can diverge.
- Two modules are implementing related pricing logic separately.

What breaks:

- Region-specific and country-wide rate precedence can be inconsistent.
- Future pricing changes become fragile because logic is duplicated.

Customer impact:

- Checkout can show one shipping price but the server can persist another.

Admin impact:

- Shipping rules become harder to trust and debug.

Evidence:

- [shipping-options.service.ts](/d:/Repositories/template/e-commerce/src/module/shipping-config/shipping-options.service.ts:8)
- [shipping-config.schema.ts](/d:/Repositories/template/e-commerce/src/module/shipping-config/shipping-config.schema.ts:89)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:235)

### 6. High: warehouse-aware inventory is only partially connected

What the system does now:

- Inventory schema supports warehouse-aware rows.
- Cart reservation helper can reserve by warehouse when provided.
- Checkout deducts inventory by first matching variant row.
- Cart update/remove/clear often release by `variantId` only.
- Product-variant create/update still create or update inventory without full warehouse handling.
- Inventory edit form submits `warehouseId`, but backend `inventory.update` ignores it.

Why this is wrong:

- Warehouse logic exists in pieces, not as one connected fulfillment model.

What breaks:

- Wrong warehouse can be reserved or released.
- Order stock deduction may not align with the reserved warehouse.
- Admin inventory UI suggests stronger warehouse support than actually exists.

Customer impact:

- Stock availability can be unreliable when multiple warehouses hold the same variant.

Admin impact:

- Warehouse-level stock reporting is not fully trustworthy.
- Inventory edit UI over-promises what the backend supports.

Evidence:

- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:95)
- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:377)
- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:470)
- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:516)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:399)
- [product-variant.api.ts](/d:/Repositories/template/e-commerce/src/module/product-variant/product-variant.api.ts:48)
- [product-variant.api.ts](/d:/Repositories/template/e-commerce/src/module/product-variant/product-variant.api.ts:200)
- [inventory.api.ts](/d:/Repositories/template/e-commerce/src/module/inventory/inventory.api.ts:175)
- [inventory.api.ts](/d:/Repositories/template/e-commerce/src/module/inventory/inventory.api.ts:571)
- [inventory.component.edit-form.tsx](/d:/Repositories/template/e-commerce/src/module/inventory/inventory.component.edit-form.tsx:56)

### 7. High: studio staff/admin permissions are not aligned with the screens

What the system does now:

- Studio order and payment pages block only customers at the route level.
- Those pages then call `adminProcedure` APIs for listing or reading data.
- Staff can enter the page but may fail on the actual API calls.
- Shipping config list endpoints are staff-readable, but create/update are admin-only.

Why this is wrong:

- Route access policy and API access policy are inconsistent.

What breaks:

- Staff experience in studio can be partially broken.
- Permission model is harder to reason about operationally.

Customer impact:

- None directly.

Admin/staff impact:

- Staff may see screens that cannot fully function.
- Operational tooling becomes role-fragile.

Evidence:

- [studio/orders/page.tsx](/d:/Repositories/template/e-commerce/src/app/(studio)/studio/orders/page.tsx:21)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:96)
- [studio/payment/page.tsx](/d:/Repositories/template/e-commerce/src/app/(studio)/studio/payment/page.tsx:21)
- [payment.api.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.api.ts:47)
- [shipping-config.api.ts](/d:/Repositories/template/e-commerce/src/module/shipping-config/shipping-config.api.ts:35)
- [shipping-config.api.ts](/d:/Repositories/template/e-commerce/src/module/shipping-config/shipping-config.api.ts:56)

### 8. High: order state transitions are too loose and the audit trail is missing

What the system does now:

- `order.updateStatus` accepts any target status.
- No transition rules exist.
- Bulk actions can mark orders as shipped or cancelled without business validation.
- `orderStatusHistory` exists in schema but is not written anywhere.
- `returned` exists as a valid order status, but the order timeline does not model it.

Why this is wrong:

- Order status should be a controlled state machine, not a free-form field update.

What breaks:

- Unpaid orders can be marked shipped.
- Delivered/cancelled transitions can become nonsensical.
- There is no durable history of operational changes.

Customer impact:

- Order timeline can become inaccurate.

Admin impact:

- Staff can accidentally create impossible order states.
- No formal status audit trail exists.

Evidence:

- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:467)
- [order-status-actions.tsx](/d:/Repositories/template/e-commerce/src/module/order/components/order-status-actions.tsx:15)
- [order.bulk-actions.ts](/d:/Repositories/template/e-commerce/src/module/order/order.bulk-actions.ts:20)
- [order-timeline.tsx](/d:/Repositories/template/e-commerce/src/module/order/components/order-timeline.tsx:10)
- [db.schema.ts](/d:/Repositories/template/e-commerce/src/core/db/db.schema.ts:764)

### 9. Medium: invoice, refund, and payment-recovery features are mostly placeholders

What the system does now:

- Customer invoice page is empty.
- Studio order detail has buttons for:
  - Send invoice
  - Print invoice
  - Collect payment
  - Issue refund
- These actions are present in UI but not connected to implemented workflows.
- Payment status supports `refunded`, but there is no refund business flow.

Why this is wrong:

- The UI implies complete back-office operations that do not exist.

What breaks:

- Staff may assume a refund or invoice feature exists when it does not.
- Customer self-service invoice access is non-functional.

Customer impact:

- Invoice screen is a dead end.

Admin impact:

- Order/payment action surfaces are misleading.

Evidence:

- [invoice/page.tsx](/d:/Repositories/template/e-commerce/src/app/(account)/account/order/[id]/invoice/page.tsx:1)
- [order-overview-card.tsx](/d:/Repositories/template/e-commerce/src/module/order/components/order-overview-card.tsx:58)
- [order-payment-card.tsx](/d:/Repositories/template/e-commerce/src/module/order/components/order-payment-card.tsx:37)
- [payment.api.ts](/d:/Repositories/template/e-commerce/src/module/payment/payment.api.ts:43)

### 10. Medium: guest cart exists, but guest checkout does not exist as a complete flow

What the system does now:

- Cart supports guest session IDs.
- Guest cart can merge into user cart after login.
- Cart buttons route to `/account/cart`.
- Checkout route requires authentication.
- Order contract still advertises `sessionId` and guest-oriented inputs.

Why this is wrong:

- The browse/cart experience suggests guest shopping is supported.
- The checkout experience then forces an account-based path.

What breaks:

- Customer funnel is inconsistent.
- Guest cart and account UI are mixed together.

Customer impact:

- Users can add items before sign-in but then hit an account-only cart/checkout path.

Admin impact:

- Funnel behavior is harder to reason about and support.

Evidence:

- [cart.schema.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.schema.ts:85)
- [use-cart.ts](/d:/Repositories/template/e-commerce/src/module/cart/use-cart.ts:13)
- [cart-button.tsx](/d:/Repositories/template/e-commerce/src/shared/components/common/cart-button.tsx:16)
- [view-cart-button.tsx](/d:/Repositories/template/e-commerce/src/shared/components/common/view-cart-button.tsx:24)
- [checkout/page.tsx](/d:/Repositories/template/e-commerce/src/app/(store)/store/checkout/page.tsx:21)

### 11. Medium: payment status and shipment return flows are only partially integrated

What the system does now:

- Shipment return updates order status to `returned`.
- Inventory is restored on first shipment return transition, but only if `order.warehouseId` exists.
- Checkout never sets `warehouseId` on new orders.
- Payment refund flow is not connected.

Why this is wrong:

- Returns, inventory restoration, warehouse assignment, and refunds should be one connected flow.

What breaks:

- Returned shipments may not restore stock when warehouse is missing.
- Returned orders do not imply any refund process.

Customer impact:

- Return state may not match payment/refund reality.

Admin impact:

- Return operations depend on data that current checkout never populates.

Evidence:

- [shipment.api.ts](/d:/Repositories/template/e-commerce/src/module/shipment/shipment.api.ts:256)
- [shipment.api.ts](/d:/Repositories/template/e-commerce/src/module/shipment/shipment.api.ts:296)
- [order.api.ts](/d:/Repositories/template/e-commerce/src/module/order/order.api.ts:350)
- [inventory.api.ts](/d:/Repositories/template/e-commerce/src/module/inventory/inventory.api.ts:22)

### 12. Medium: reservation records are not fully lifecycle-managed

What the system does now:

- Cart reservation inserts rows into `inventoryReservation` with `expiresAt`.
- Release logic reduces reserved stock through `applyInventoryDelta`.
- There is no visible cleanup path removing expired reservations.
- Order placement clears cart lines but does not explicitly reconcile reservation rows.

Why this is wrong:

- Reservation bookkeeping is incomplete.

What breaks:

- Reservation table can accumulate stale rows.
- Reserved stock may no longer reflect the real reservation source cleanly.

Customer impact:

- Can contribute to inventory availability drift.

Admin impact:

- Reservation/audit data becomes less trustworthy.

Evidence:

- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:110)
- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:145)
- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:424)
- [cart.api.ts](/d:/Repositories/template/e-commerce/src/module/cart/cart.api.ts:516)

## Current System by Domain

### Orders

Current system behavior:

- Orders are created from cart lines.
- Order items snapshot product title, variant title, quantity, price, and attributes.
- Discount code can be applied during order creation.
- Shipping method/provider are validated at order creation time.
- Order status starts as `pending`.
- Payment confirmation later changes order to `paid`.
- Shipment updates can move order to `shipped`, `delivered`, `returned`, or sometimes `cancelled`.

What is connected properly:

- Order item snapshotting is implemented.
- Shipping provider/method validation exists.
- Order detail pages exist for account/store/studio.

Where business logic breaks:

- Order creation happens before payment success.
- Tax is not properly calculated/stored.
- Warehouse assignment is not populated.
- Status transitions are too loose.
- Status history table is unused.

### Payments

Current system behavior:

- Checkout currently uses Razorpay.
- Payment intent is created after order creation.
- Payment confirmation updates payment row and marks order `paid`.
- Webhook reconciliation exists for `payment.captured` and `payment.failed`.

What is connected properly:

- Razorpay order creation exists.
- Razorpay signature verification exists.
- Webhook reconciliation exists.

Where business logic breaks:

- Order/inventory/cart are already mutated before payment success.
- Failed payment does not restore business state.
- `getStatus` does not enforce ownership.
- Non-Razorpay providers are exposed but not safely implemented.
- Refund business flow is missing.

### Shipping

Current system behavior:

- Shipping providers, methods, zones, and rate rules are manageable in studio.
- Checkout loads shipping options based on shipping address.
- Staff creates one shipment per paid order.
- Shipment status updates also update parent order status.

What is connected properly:

- Shipment creation after payment exists.
- Shipment timeline and status forms are implemented.
- Shipping config CRUD exists for admin/staff reading.

Where business logic breaks:

- Checkout pricing path and order pricing path are duplicated.
- Shipment return depends on warehouse data that orders usually do not have.
- Customer shipment access checks are inconsistent for non-`customer` user roles.
- Some shipping operations are role-inconsistent between page and API.

### Inventory

Current system behavior:

- Inventory supports quantity, incoming, reserved, and warehouse ID.
- Cart reservations increase `reserved`.
- Order creation reduces quantity and reserved.
- Studio inventory pages and warehouse pages exist.
- Inventory movement records exist through `inventoryAdjustmentEvent`.

What is connected properly:

- Centralized delta helper exists.
- Inventory movement events are logged in several flows.
- Warehouse model exists.

Where business logic breaks:

- Warehouse awareness is incomplete across cart/order/product-variant.
- Reservation lifecycle is incomplete.
- Inventory edit UI suggests warehouse changes that backend ignores.
- Sales-driven movement logging is better than before, but wider warehouse assignment is still not coherent.

## How Client Sees the System

Customer currently experiences:

1. Product browsing and add-to-cart works.
2. Cart can work before sign-in because session cart exists.
3. Cart route and checkout route push the customer into account/authenticated flow.
4. Checkout shows delivery options, order summary, and Razorpay payment.
5. After payment success, customer sees order confirmation and can view order details.
6. Shipment tracking appears once a shipment exists.

What the customer will misunderstand:

- Displayed amounts can be wrong because money formatting is inconsistent.
- Shipping/tax summary may not match server logic.
- Payment failure may appear to fail cleanly while stock/cart/discount state was already changed.
- Invoice/self-service document behavior is incomplete.

## How Admin/Studio Sees the System

Studio user currently experiences:

1. Inventory, warehouse, shipping config, orders, shipments, and payments all appear to exist as operational modules.
2. Orders can be reviewed and status-changed.
3. Paid orders can get shipments created.
4. Payment rows can be browsed.

What admin/staff will misunderstand:

- Inventory and warehouse screens imply a stronger warehouse fulfillment model than the live runtime actually has.
- Order actions imply invoice/refund/payment collection flows that are not implemented.
- Staff access to some studio surfaces may be allowed by route but blocked by API.
- Pending unpaid orders may already have consumed stock.

## API Logic That Is Not Properly Done

Most problematic APIs:

- `order.create`
  - finalizes business state before payment succeeds
- `payment.confirm`
  - trusts client-completed status for non-Razorpay providers
- `payment.getStatus`
  - lacks ownership verification
- `order.get`
  - ownership gate is incomplete for non-staff authenticated roles
- `order.getMany`
  - same role-model ambiguity
- `shipment.getByOrder`
  - same ownership ambiguity
- shipping option pricing split between:
  - `shippingConfig.getOptions`
  - `order.create`

## UI That Is Not Properly Done

Most problematic UI surfaces:

- Checkout summary
  - hardcoded shipping/tax/discount presentation
- Cart summary and cart item totals
  - money formatting mismatch
- Order summary and order cards
  - money formatting mismatch
- Studio order detail action buttons
  - mostly placeholders
- Customer invoice page
  - empty
- Guest cart -> account cart -> auth checkout path
  - inconsistent funnel
- Studio pages for staff users
  - access expectations do not always match API permissions

## Bottom Line

The current system is not missing isolated features. The bigger issue is that the business flow sequencing is wrong in a few core places:

- payment is treated as the end of checkout in UI, but order finalization happens before payment in backend
- warehouse-aware inventory exists in schema, but not as one coherent fulfillment model
- customer access control is inconsistent in resource APIs
- totals shown to users are not driven by one authoritative pricing path

That means shipping, inventory, order, and payment modules all exist, but the integration between them is not yet safe enough to be treated as production-grade commerce logic.
