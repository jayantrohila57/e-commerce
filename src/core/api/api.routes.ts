import { createCallerFactory, createTRPCRouter } from '@/core/api/api.methods'

import { addressRouter } from '@/module/address/address.api'
import { cartRouter } from '@/module/cart/cart.api'
import { categoryRouter } from '@/module/category/category.api'
import { inventoryRouter } from '@/module/inventory/inventory.api'
import { productVariantRouter } from '@/module/product-variant/product-variant.api'
import { productRouter } from '@/module/product/product.api'
import { seriesRouter } from '@/module/series/series.api'
import { subcategoryRouter } from '@/module/subcategory/subcategory.api'
import { wishlistRouter } from '@/module/wishlist/wishlist.api'

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  subcategory: subcategoryRouter,
  series: seriesRouter,
  product: productRouter,
  productVariant: productVariantRouter,
  cart: cartRouter,
  inventory: inventoryRouter,
  wishlist: wishlistRouter,
  address: addressRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
