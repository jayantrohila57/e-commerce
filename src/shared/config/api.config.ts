export const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAILED: 'failed',
} as const

export const MESSAGE = {
  USER: {
    CREATE: {
      SUCCESS: 'User created successfully.',
      FAILED: 'Failed to create user.',
      ERROR: 'Unexpected error while creating user.',
    },
    GET: {
      SUCCESS: 'User retrieved successfully.',
      FAILED: 'User not found.',
      ERROR: 'Unexpected error while retrieving user.',
    },
    GET_MANY: {
      SUCCESS: 'Users retrieved successfully.',
      FAILED: 'No users found.',
      ERROR: 'Unexpected error while retrieving users.',
    },
    UPDATE: {
      SUCCESS: 'User updated successfully.',
      FAILED: 'Failed to update user.',
      ERROR: 'Unexpected error while updating user.',
    },
    DELETE: {
      SUCCESS: 'User deleted successfully.',
      FAILED: 'Failed to delete user.',
      ERROR: 'Unexpected error while deleting user.',
    },
  },
  ADDRESS: {
    CREATE: {
      SUCCESS: 'Address created successfully.',
      FAILED: 'Failed to create address.',
      ERROR: 'Unexpected error while creating address.',
    },
    GET: {
      SUCCESS: 'Address retrieved successfully.',
      FAILED: 'Address not found.',
      ERROR: 'Unexpected error while retrieving address.',
    },
    GET_MANY: {
      SUCCESS: 'Addresses retrieved successfully.',
      FAILED: 'No addresses found.',
      ERROR: 'Unexpected error while retrieving addresses.',
    },
    GET_USER_ADDRESSES: {
      SUCCESS: 'User addresses retrieved successfully.',
      FAILED: 'No addresses found for user.',
      ERROR: 'Unexpected error while retrieving user addresses.',
    },
    UPDATE: {
      SUCCESS: 'Address updated successfully.',
      FAILED: 'Failed to update address.',
      ERROR: 'Unexpected error while updating address.',
    },
    DELETE: {
      SUCCESS: 'Address deleted successfully.',
      FAILED: 'Failed to delete address.',
      ERROR: 'Unexpected error while deleting address.',
    },
  },
  WISHLIST: {
    CREATE: {
      SUCCESS: 'Wishlist created successfully.',
      FAILED: 'Failed to create wishlist.',
      ERROR: 'Unexpected error while creating wishlist.',
    },
    GET: {
      SUCCESS: 'Wishlist retrieved successfully.',
      FAILED: 'Wishlist not found.',
      ERROR: 'Unexpected error while retrieving wishlist.',
    },
    GET_MANY: {
      SUCCESS: 'Wishlists retrieved successfully.',
      FAILED: 'No wishlists found.',
      ERROR: 'Unexpected error while retrieving wishlists.',
    },
    GET_USER_WISHLIST: {
      SUCCESS: 'User wishlist retrieved successfully.',
      FAILED: 'Wishlist not found for user.',
      ERROR: 'Unexpected error while retrieving user wishlist.',
    },
    ADD_ITEM: {
      SUCCESS: 'Item added to wishlist successfully.',
      FAILED: 'Failed to add item to wishlist.',
      ERROR: 'Unexpected error while adding item to wishlist.',
    },
    REMOVE_ITEM: {
      SUCCESS: 'Item removed from wishlist successfully.',
      FAILED: 'Failed to remove item from wishlist.',
      ERROR: 'Unexpected error while removing item from wishlist.',
    },
    DELETE: {
      SUCCESS: 'Wishlist deleted successfully.',
      FAILED: 'Failed to delete wishlist.',
      ERROR: 'Unexpected error while deleting wishlist.',
    },
  },
  CART: {
    CREATE: {
      SUCCESS: 'Cart created successfully.',
      FAILED: 'Failed to create cart.',
      ERROR: 'Unexpected error while creating cart.',
    },
    GET: {
      SUCCESS: 'Cart retrieved successfully.',
      FAILED: 'Cart not found.',
      ERROR: 'Unexpected error while retrieving cart.',
    },
    GET_MANY: {
      SUCCESS: 'Carts retrieved successfully.',
      FAILED: 'No carts found.',
      ERROR: 'Unexpected error while retrieving carts.',
    },
    GET_USER_CART: {
      SUCCESS: 'User cart retrieved successfully.',
      FAILED: 'Cart not found for user.',
      ERROR: 'Unexpected error while retrieving user cart.',
    },
    ADD_ITEM: {
      SUCCESS: 'Item added to cart successfully.',
      FAILED: 'Failed to add item to cart.',
      ERROR: 'Unexpected error while adding item to cart.',
    },
    UPDATE_ITEM: {
      SUCCESS: 'Cart item updated successfully.',
      FAILED: 'Failed to update cart item.',
      ERROR: 'Unexpected error while updating cart item.',
    },
    REMOVE_ITEM: {
      SUCCESS: 'Item removed from cart successfully.',
      FAILED: 'Failed to remove item from cart.',
      ERROR: 'Unexpected error while removing item from cart.',
    },
    CLEAR_CART: {
      SUCCESS: 'Cart cleared successfully.',
      FAILED: 'Failed to clear cart.',
      ERROR: 'Unexpected error while clearing cart.',
    },
    UPDATE: {
      SUCCESS: 'Cart updated successfully.',
      FAILED: 'Failed to update cart.',
      ERROR: 'Unexpected error while updating cart.',
    },
    DELETE: {
      SUCCESS: 'Cart deleted successfully.',
      FAILED: 'Failed to delete cart.',
      ERROR: 'Unexpected error while deleting cart.',
    },
  },

  ORDER: {
    CREATE: {
      SUCCESS: 'Order created successfully.',
      FAILED: 'Failed to create order.',
      ERROR: 'Unexpected error while creating order.',
    },
    GET: {
      SUCCESS: 'Order retrieved successfully.',
      FAILED: 'Order not found.',
      ERROR: 'Unexpected error while retrieving order.',
    },
    GET_MANY: {
      SUCCESS: 'Orders retrieved successfully.',
      FAILED: 'No orders found.',
      ERROR: 'Unexpected error while retrieving orders.',
    },
    GET_USER_ORDERS: {
      SUCCESS: 'User orders retrieved successfully.',
      FAILED: 'No orders found for user.',
      ERROR: 'Unexpected error while retrieving user orders.',
    },
    GET_ORDER_WITH_ITEMS: {
      SUCCESS: 'Order with items retrieved successfully.',
      FAILED: 'Order not found.',
      ERROR: 'Unexpected error while retrieving order with items.',
    },
    UPDATE: {
      SUCCESS: 'Order updated successfully.',
      FAILED: 'Failed to update order.',
      ERROR: 'Unexpected error while updating order.',
    },
    CANCEL_ORDER: {
      SUCCESS: 'Order cancelled successfully.',
      FAILED: 'Failed to cancel order.',
      ERROR: 'Unexpected error while cancelling order.',
    },
    DELETE: {
      SUCCESS: 'Order deleted successfully.',
      FAILED: 'Failed to delete order.',
      ERROR: 'Unexpected error while deleting order.',
    },
  },
  SHIPMENT: {
    CREATE: {
      SUCCESS: 'Shipment created successfully.',
      FAILED: 'Failed to create shipment.',
      ERROR: 'Unexpected error while creating shipment.',
    },
    GET: {
      SUCCESS: 'Shipment retrieved successfully.',
      FAILED: 'Shipment not found.',
      ERROR: 'Unexpected error while retrieving shipment.',
    },
    GET_MANY: {
      SUCCESS: 'Shipments retrieved successfully.',
      FAILED: 'No shipments found.',
      ERROR: 'Unexpected error while retrieving shipments.',
    },
    GET_ORDER_SHIPMENTS: {
      SUCCESS: 'Order shipments retrieved successfully.',
      FAILED: 'No shipments found for order.',
      ERROR: 'Unexpected error while retrieving order shipments.',
    },
    UPDATE: {
      SUCCESS: 'Shipment updated successfully.',
      FAILED: 'Failed to update shipment.',
      ERROR: 'Unexpected error while updating shipment.',
    },
    UPDATE_TRACKING: {
      SUCCESS: 'Shipment tracking updated successfully.',
      FAILED: 'Failed to update shipment tracking.',
      ERROR: 'Unexpected error while updating shipment tracking.',
    },
    DELETE: {
      SUCCESS: 'Shipment deleted successfully.',
      FAILED: 'Failed to delete shipment.',
      ERROR: 'Unexpected error while deleting shipment.',
    },
  },
  CATEGORY: {
    CREATE: {
      SUCCESS: 'Category created successfully.',
      FAILED: 'Failed to create category.',
      ERROR: 'Unexpected error while creating category.',
    },
    GET: {
      SUCCESS: 'Category retrieved successfully.',
      FAILED: 'Category not found.',
      ERROR: 'Unexpected error while retrieving category.',
    },
    GET_MANY: {
      SUCCESS: 'Categories retrieved successfully.',
      FAILED: 'No categories found.',
      ERROR: 'Unexpected error while retrieving categories.',
    },
    UPDATE: {
      SUCCESS: 'Category updated successfully.',
      FAILED: 'Failed to update category.',
      ERROR: 'Unexpected error while updating category.',
    },
    DELETE: {
      SUCCESS: 'Category deleted successfully.',
      FAILED: 'Failed to delete category.',
      ERROR: 'Unexpected error while deleting category.',
    },
    RESTORE: {
      SUCCESS: 'Category restored successfully.',
      FAILED: 'Failed to restore category.',
      ERROR: 'Unexpected error while restoring category.',
    },
    TOGGLE_VISIBILITY: {
      SUCCESS: 'Category visibility updated successfully.',
      FAILED: 'Failed to update category visibility.',
      ERROR: 'Unexpected error while updating category visibility.',
    },
    TOGGLE_FEATURED: {
      SUCCESS: 'Category featured status updated successfully.',
      FAILED: 'Failed to update category featured status.',
      ERROR: 'Unexpected error while updating category featured status.',
    },
    REORDER: {
      SUCCESS: 'Categories reordered successfully.',
      FAILED: 'Failed to reorder categories.',
      ERROR: 'Unexpected error while reordering categories.',
    },
    SEARCH: {
      SUCCESS: 'Category search completed successfully.',
      FAILED: 'No categories matched the search query.',
      ERROR: 'Unexpected error while searching categories.',
    },
  },
  SUBCATEGORY: {
    CREATE: {
      SUCCESS: 'Subcategory created successfully.',
      FAILED: 'Failed to create subcategory.',
      ERROR: 'Unexpected error while creating subcategory.',
    },
    GET: {
      SUCCESS: 'Subcategory retrieved successfully.',
      FAILED: 'Subcategory not found.',
      ERROR: 'Unexpected error while retrieving subcategory.',
    },
    GET_MANY: {
      SUCCESS: 'Subcategories retrieved successfully.',
      FAILED: 'No subcategories found.',
      ERROR: 'Unexpected error while retrieving subcategories.',
    },
    UPDATE: {
      SUCCESS: 'Subcategory updated successfully.',
      FAILED: 'Failed to update subcategory.',
      ERROR: 'Unexpected error while updating subcategory.',
    },
    DELETE: {
      SUCCESS: 'Subcategory deleted successfully.',
      FAILED: 'Failed to delete subcategory.',
      ERROR: 'Unexpected error while deleting subcategory.',
    },
    RESTORE: {
      SUCCESS: 'Subcategory restored successfully.',
      FAILED: 'Failed to restore subcategory.',
      ERROR: 'Unexpected error while restoring subcategory.',
    },
    TOGGLE_VISIBILITY: {
      SUCCESS: 'Subcategory visibility updated successfully.',
      FAILED: 'Failed to update subcategory visibility.',
      ERROR: 'Unexpected error while updating subcategory visibility.',
    },
    TOGGLE_FEATURED: {
      SUCCESS: 'Subcategory featured status updated successfully.',
      FAILED: 'Failed to update subcategory featured status.',
      ERROR: 'Unexpected error while updating subcategory featured status.',
    },
    REORDER: {
      SUCCESS: 'Subcategories reordered successfully.',
      FAILED: 'Failed to reorder subcategories.',
      ERROR: 'Unexpected error while reordering subcategories.',
    },
    SEARCH: {
      SUCCESS: 'Subcategory search completed successfully.',
      FAILED: 'No subcategories matched the search query.',
      ERROR: 'Unexpected error while searching subcategories.',
    },
  },
  DISCOUNT: {
    CREATE: {
      SUCCESS: 'Discount created successfully.',
      FAILED: 'Failed to create discount.',
      ERROR: 'Unexpected error while creating discount.',
    },
    GET: {
      SUCCESS: 'Discount retrieved successfully.',
      FAILED: 'Discount not found.',
      ERROR: 'Unexpected error while retrieving discount.',
    },
    GET_MANY: {
      SUCCESS: 'Discounts retrieved successfully.',
      FAILED: 'No discounts found.',
      ERROR: 'Unexpected error while retrieving discounts.',
    },
    VALIDATE_CODE: {
      SUCCESS: 'Discount code validated successfully.',
      FAILED: 'Invalid or expired discount code.',
      ERROR: 'Unexpected error while validating discount code.',
    },
    UPDATE: {
      SUCCESS: 'Discount updated successfully.',
      FAILED: 'Failed to update discount.',
      ERROR: 'Unexpected error while updating discount.',
    },
    DELETE: {
      SUCCESS: 'Discount deleted successfully.',
      FAILED: 'Failed to delete discount.',
      ERROR: 'Unexpected error while deleting discount.',
    },
  },
  PRODUCT: {
    CREATE: {
      SUCCESS: 'Product created successfully.',
      FAILED: 'Failed to create product.',
      ERROR: 'Unexpected error while creating product.',
    },
    GET: {
      SUCCESS: 'Product retrieved successfully.',
      FAILED: 'Product not found.',
      ERROR: 'Unexpected error while retrieving product.',
    },
    GET_WITH_DETAILS: {
      SUCCESS: 'Product with details retrieved successfully.',
      FAILED: 'Product not found.',
      ERROR: 'Unexpected error while retrieving product with details.',
    },
    GET_MANY: {
      SUCCESS: 'Products retrieved successfully.',
      FAILED: 'No products found.',
      ERROR: 'Unexpected error while retrieving products.',
    },
    SEARCH_PRODUCTS: {
      SUCCESS: 'Products searched successfully.',
      FAILED: 'No products found.',
      ERROR: 'Unexpected error while searching products.',
    },
    GET_PRODUCTS_BY_CATEGORY: {
      SUCCESS: 'Products by category retrieved successfully.',
      FAILED: 'No products found in category.',
      ERROR: 'Unexpected error while retrieving products by category.',
    },
    UPDATE: {
      SUCCESS: 'Product updated successfully.',
      FAILED: 'Failed to update product.',
      ERROR: 'Unexpected error while updating product.',
    },
    DELETE: {
      SUCCESS: 'Product deleted successfully.',
      FAILED: 'Failed to delete product.',
      ERROR: 'Unexpected error while deleting product.',
    },
  },
  SERIES: {
    CREATE: {
      SUCCESS: 'Series created successfully.',
      FAILED: 'Failed to create series.',
      ERROR: 'Unexpected error while creating series.',
    },
    GET: {
      SUCCESS: 'Series retrieved successfully.',
      FAILED: 'Series not found.',
      ERROR: 'Unexpected error while retrieving series.',
    },
    GET_MANY: {
      SUCCESS: 'Series retrieved successfully.',
      FAILED: 'No series found.',
      EMPTY: 'No series found matching the criteria.',
      ERROR: 'Unexpected error while retrieving series.',
    },
    UPDATE: {
      SUCCESS: 'Series updated successfully.',
      FAILED: 'Failed to update series.',
      ERROR: 'Unexpected error while updating series.',
    },
    DELETE: {
      SUCCESS: 'Series deleted successfully.',
      FAILED: 'Failed to delete series.',
      ERROR: 'Unexpected error while deleting series.',
    },
    RESTORE: {
      SUCCESS: 'Series restored successfully.',
      FAILED: 'Failed to restore series.',
      ERROR: 'Unexpected error while restoring series.',
    },
    TOGGLE_VISIBILITY: {
      SUCCESS: 'Series visibility updated successfully.',
      FAILED: 'Failed to update series visibility.',
      ERROR: 'Unexpected error while updating series visibility.',
    },
    TOGGLE_FEATURED: {
      SUCCESS: 'Series featured status updated successfully.',
      FAILED: 'Failed to update series featured status.',
      ERROR: 'Unexpected error while updating series featured status.',
    },
    REORDER: {
      SUCCESS: 'Series reordered successfully.',
      FAILED: 'Failed to reorder series.',
      ERROR: 'Unexpected error while reordering series.',
    },
    SEARCH: {
      SUCCESS: 'Series search completed successfully.',
      FAILED: 'No series found matching the search criteria.',
      ERROR: 'Unexpected error while searching series.',
    },
  },
  REVIEW: {
    CREATE: {
      SUCCESS: 'Review created successfully.',
      FAILED: 'Failed to create review.',
      ERROR: 'Unexpected error while creating review.',
    },
    GET: {
      SUCCESS: 'Review retrieved successfully.',
      FAILED: 'Review not found.',
      ERROR: 'Unexpected error while retrieving review.',
    },
    GET_MANY: {
      SUCCESS: 'Reviews retrieved successfully.',
      FAILED: 'No reviews found.',
      ERROR: 'Unexpected error while retrieving reviews.',
    },
    GET_PRODUCT_REVIEWS: {
      SUCCESS: 'Product reviews retrieved successfully.',
      FAILED: 'No reviews found for product.',
      ERROR: 'Unexpected error while retrieving product reviews.',
    },
    GET_USER_REVIEWS: {
      SUCCESS: 'User reviews retrieved successfully.',
      FAILED: 'No reviews found for user.',
      ERROR: 'Unexpected error while retrieving user reviews.',
    },
    UPDATE: {
      SUCCESS: 'Review updated successfully.',
      FAILED: 'Failed to update review.',
      ERROR: 'Unexpected error while updating review.',
    },
    DELETE: {
      SUCCESS: 'Review deleted successfully.',
      FAILED: 'Failed to delete review.',
      ERROR: 'Unexpected error while deleting review.',
    },
  },
} as const
