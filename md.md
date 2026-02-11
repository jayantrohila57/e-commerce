# Checkout implementation roadmap

This document lays out an ordered, practical plan to implement a full checkout flow: from storing addresses to final order confirmation and cleanup.

> You are currently on STEP 1 — Shipping Address CRUD.

---

## Step 1 — Implement Shipping Address CRUD (you’re here)

Requirements

- Create a UI form to accept: `name`, `phone`, `street`, `city`, `state`, `pincode` (postal code), and `country`.
- Persist addresses to the `shipping_address` table.
- Allow updating existing addresses.
- Ensure only one active/default address per cart (or per user depending on your model).

When this is done, move on to Step 2.

---

## Step 2 — Build Cart Totals Calculator (in-memory, TypeScript)

Notes

- No DB table required — build a pure TypeScript function.
- The function should compute:
  - `subtotal`
  - `discount` (if a coupon exists)
  - `shipping` (use a flat rate for now)
  - `tax` (hardcode if necessary during early iterations)
  - `grand total`
- Make this function reusable throughout the codebase (single source of truth for totals).

---

## Step 3 — Add Coupon Apply/Remove Flow

- Validate coupon rules: active flag, date range, minimum purchase.
- Use the totals calculator to compute discount amount.
- Persist applied coupon details to `cart_coupon`.
- Provide an action to remove the coupon and recompute totals on cart load/refresh.

Small table; large impact on UX and revenue management.

---

## Step 4 — Sync Inventory Reservations on Each Cart Change

Whenever cart quantities change you must:

- Reserve stock for the requested quantity.
- Release reservations for quantities that are decreased or cancelled.
- Prevent users from adding more than available stock.

This avoids overselling and keeps inventory accurate under concurrency.

---

## Step 5 — Implement “Review Order” Screen

This screen is the pre-payment truth and must display:

- Products and selected variants
- Quantities
- Shipping address
- Applied coupon (if any)
- Final totals (calculated live using the totals calculator)

---

## Step 6 — Create Payment Intent (Stripe / Razorpay)

Flow

- Call the totals calculator to compute the payable amount.
- Send the amount to the provider to create a payment intent.
- Save the provider's intent ID to a `payment_intent` table.
- Return the provider payment object to the frontend.

This step locks the payable amount before the user completes the payment flow.

---

## Step 7 — Handle Payment Webhook (the final boss)

On successful payment webhook:

- Fetch the `payment_intent` by provider ID.
- Convert the cart to an `order` record.
- Convert `cart_line` → `order_line`.
- Deduct quantities from `inventory_item`.
- Clear `inventory_reservation` entries.
- Mark the cart as closed and immutable.

This is where the order becomes permanent.

---

## Step 8 — Return Order Summary to Frontend

After the webhook handling finishes, frontend pages should fetch the canonical order details:

- `order` and `order_line`
- computed `totals`
- `shipping address`
- `payment status`

This is the “Thank You” page and final confirmation for the user.

---

## Step 9 — Cart Cleanup & Reset

- Create a fresh, empty cart for the user/session.
- Lock the old cart to prevent further edits.

User can now continue shopping with a clean cart.
