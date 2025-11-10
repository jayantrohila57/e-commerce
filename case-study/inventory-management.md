# Case Study: Inventory Management Architecture for Variant-Based Products

## Context

An e-commerce system sells products that may have multiple variations such as size, color, or material. Each variation is physically distinct, stored, tracked, and sold as an independent stock unit. The existing schema stores product information and product variants, but inventory (quantity tracking) has been maintained directly on the `product_variant` table.

This approach becomes brittle when:

- Multiple warehouses are introduced.
- Reserved stock is needed for carts or order confirmation.
- Stock adjustments must be auditable.
- Purchase orders and replenishment workflows appear.
- Future scaling demands accuracy and concurrency safety.

To address these concerns, inventory must be managed in a dedicated table.

## Problem

Storing stock on the `product_variant` table causes:

- Inability to support multiple warehouses: A variant can exist in different physical storage locations. A single stock field cannot represent distributed quantities.
- No separation of available vs. reserved stock: Real commerce must differentiate:
  - Quantity physically available
  - Quantity held (reserved) for ongoing checkout flows
- Difficulties performing accurate stock movements: Updating the same field for every operational event leads to race conditions and inconsistent stock states.
- No structure for future purchase order and restocking workflows: Stock changes need traceability. A static field prevents audit trails.

## Solution

Implement a dedicated `Inventory` table that tracks stock at the variant + warehouse level and separates available stock from reserved stock.
