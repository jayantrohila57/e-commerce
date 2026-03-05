# Cart System Status & Documentation

## Overview
This document provides a comprehensive overview of the cart system implementation, including API endpoints, database schema, UI components, and current status for both authenticated and unauthenticated users.

## Database Schema

### Core Tables

#### `cart` Table
```sql
CREATE TABLE cart (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
  session_id TEXT,
  updated_at TIMESTAMP WITH TIMEZONE DEFAULT NOW() ON UPDATE NOW()
);

-- Indexes
CREATE INDEX cart_user_id_idx ON cart(user_id);
CREATE INDEX cart_session_id_idx ON cart(session_id);
```

**Fields:**
- `id`: Unique cart identifier (UUID)
- `userId`: Associated user ID (nullable for guest carts)
- `sessionId`: Session identifier for guest carts
- `updatedAt`: Last modification timestamp

#### `cart_line` Table
```sql
CREATE TABLE cart_line (
  id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL REFERENCES product_variant(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_snapshot INTEGER NOT NULL
);

-- Indexes
CREATE INDEX cart_line_cart_id_idx ON cart_line(cart_id);
CREATE INDEX cart_line_variant_id_idx ON cart_line(variant_id);
```

**Fields:**
- `id`: Unique line item identifier (UUID)
- `cartId`: Reference to parent cart
- `variantId`: Product variant ID
- `quantity`: Item quantity (minimum 1)
- `price`: Price snapshot in smallest currency unit (prevents price changes)

### Supporting Tables

#### `inventory_item` & `inventory_reservation`
- Used for real-time inventory management
- Reserves items when added to cart (30-minute expiration)
- Prevents overselling

#### `cart_abandonment` & `cart_abandonment_event`
- Tracks cart abandonment for analytics
- Supports recovery campaigns

## API Endpoints (tRPC)

### Cart Router: `cart`

#### Public Endpoints (Guest + Authenticated Users)

1. **GET** `cart.get`
   - **Input**: `{ query?: { userId?: string, sessionId?: string } }`
   - **Output**: `CartWithItems | null`
   - **Description**: Retrieve cart by user ID or session ID

2. **POST** `cart.add`
   - **Input**: `{ body: { variantId: string, quantity: number, sessionId?: string } }`
   - **Output**: `CartLine`
   - **Description**: Add item to cart (creates cart if needed)

3. **PUT** `cart.update`
   - **Input**: `{ params: { lineId: string }, body: { quantity: number } }`
   - **Output**: `CartLine | null`
   - **Description**: Update cart item quantity (0 = remove)

4. **DELETE** `cart.remove`
   - **Input**: `{ params: { lineId: string } }`
   - **Output**: `{ id: string } | null`
   - **Description**: Remove specific cart item

5. **POST** `cart.clear`
   - **Input**: `{ body?: { sessionId?: string } }`
   - **Output**: `{ success: boolean }`
   - **Description**: Clear entire cart

#### Protected Endpoints (Authenticated Users Only)

6. **GET** `cart.getUserCart`
   - **Input**: `{}`
   - **Output**: `CartWithItems | null`
   - **Description**: Get current user's cart (creates if needed)

7. **GET** `cart.getTotals`
   - **Input**: `{}`
   - **Output**: `{ itemCount: number, subtotal: number }`
   - **Description**: Get cart summary totals

8. **POST** `cart.merge`
   - **Input**: `{ body: { sessionId: string } }`
   - **Output**: `CartWithItems`
   - **Description**: Merge guest cart into user cart (login flow)

## Data Models & Types

### Core Schemas

```typescript
// Cart Line Item
export interface CartLine {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  price: number; // in smallest currency unit
}

// Cart with Items (Frontend Display)
export interface CartWithItems {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  updatedAt: Date;
}

// Cart Item with Product Details
export interface CartItem {
  lineId: string;
  variantId: string;
  productId: string;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string | null;
  attributes?: Array<{
    title: string;
    type: string;
    value: string;
  }> | null;
}
```

## Cart Operations Flow

### Guest User Flow
1. **Session Creation**: Browser generates unique session ID
2. **Cart Access**: Use `cart.get` with `sessionId`
3. **Add Items**: Use `cart.add` with `sessionId`
4. **Persistence**: Cart persists via session ID in browser storage

### Authenticated User Flow
1. **Login**: User authenticates via Better Auth
2. **Cart Merge**: Call `cart.merge` with previous `sessionId`
3. **Cart Access**: Use `cart.getUserCart` (auto-creates if needed)
4. **Operations**: All subsequent calls use authenticated context

### Merge Logic (Guest → User)
1. Find guest cart by `sessionId`
2. Find/create user cart by `userId`
3. For each guest cart line:
   - If variant exists in user cart: Update quantity
   - Else: Move line to user cart
4. Delete guest cart
5. Return merged user cart

## Inventory Management

### Reservation System
- **Add to Cart**: Reserves inventory for 30 minutes
- **Update Quantity**: Adjusts reservation accordingly
- **Remove Item**: Releases reservation
- **Cart Clear**: Releases all reservations
- **Reservation Expiration**: Automatic release after 30 minutes

### Price Handling
- **Price Snapshot**: Stores price at time of adding to cart
- **Price Calculation**: Base product price + variant modifiers
- **Modifier Types**: flat_increase, flat_decrease, percent_increase, percent_decrease

## UI Components Status

### ✅ Implemented
- **CartButton** (`src/shared/components/common/cart-button.tsx`)
  - Displays cart item count badge
  - Navigates to cart page
  - **Status**: Basic implementation, uses hardcoded count (3)

### 🚧 In Progress / Missing
- **Cart Page** (`src/app/(account)/account/(commerce)/commerce/cart/page.tsx`)
  - **Status**: Basic layout only, missing cart items display
  - **Missing**: Cart items list, quantity controls, totals, checkout button

- **Cart Item Components**
  - **Status**: Not implemented
  - **Missing**: Item display, image, price, quantity controls, remove button

- **Cart Summary**
  - **Status**: Not implemented
  - **Missing**: Subtotal, tax, shipping, total calculations

- **Add to Cart Button**
  - **Status**: Not found in codebase
  - **Missing**: Product page integration

## API Integration Status

### ✅ Backend Implementation
- **tRPC Router**: Fully implemented with all CRUD operations
- **Database Schema**: Complete with proper relationships and indexes
- **Inventory Management**: Real-time reservation system
- **Error Handling**: Comprehensive error responses
- **Validation**: Zod schemas for all inputs/outputs

### 🚧 Frontend Integration
- **tRPC Client**: Router configured in `api.routes.ts`
- **React Hooks**: No cart-specific hooks found
- **State Management**: No cart state management implementation
- **Real-time Updates**: No cart synchronization mechanism

## Security Considerations

### ✅ Implemented
- **Ownership Verification**: Users can only access their own carts
- **Session Isolation**: Guest carts isolated by session ID
- **Input Validation**: All inputs validated via Zod schemas
- **SQL Injection Protection**: Drizzle ORM parameterized queries

### 🚧 Additional Considerations
- **Rate Limiting**: Not implemented for cart operations
- **Session Hijacking**: Consider HTTPS-only session cookies
- **Cart Pollution**: No limits on cart items or quantities

## Performance Optimizations

### ✅ Database Level
- **Indexes**: Proper indexes on cart and cart_line tables
- **Cascade Deletes**: Automatic cleanup of orphaned records
- **Query Optimization**: Efficient joins with product/variant data

### 🚧 Application Level
- **Caching**: No cart caching implemented
- **Lazy Loading**: Cart data loaded on-demand
- **Optimistic Updates**: Not implemented

## Testing Status

### 🚧 Missing
- **Unit Tests**: No cart module tests found
- **Integration Tests**: No API endpoint tests
- **E2E Tests**: No cart flow tests
- **Load Testing**: No performance tests

## Deployment & Monitoring

### ✅ Ready
- **Database Migrations**: Schema included in main migration
- **API Routes**: Configured in tRPC router
- **Error Logging**: Debug error logging implemented

### 🚧 Needed
- **Metrics**: Cart operation metrics
- **Health Checks**: Cart service health monitoring
- **Analytics**: Cart abandonment tracking

## Next Steps & Recommendations

### High Priority
1. **Complete Cart Page UI**: Implement cart items display and controls
2. **Add to Cart Integration**: Connect product pages to cart API
3. **Cart State Management**: Implement React hooks for cart operations
4. **Real-time Updates**: Sync cart across browser tabs

### Medium Priority
1. **Cart Persistence**: Implement local storage fallback
2. **Guest Cart Recovery**: Email-based cart recovery
3. **Cart Validation**: Product availability checks
4. **Performance Testing**: Load test cart operations

### Low Priority
1. **Advanced Features**: Saved carts, cart sharing
2. **Analytics**: Enhanced cart tracking
3. **A/B Testing**: Cart conversion optimization
4. **Internationalization**: Multi-currency support

## Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Session Management
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# Inventory (if using external service)
INVENTORY_SERVICE_URL=...
```

### Constants
- **Reservation Duration**: 30 minutes
- **Price Currency**: Smallest unit (cents)
- **Max Quantity**: Not enforced (consider adding limits)

---

**Last Updated**: 2026-03-05
**Status**: Backend ✅ Complete | Frontend 🚧 In Progress
**Next Review**: After UI implementation completion
