import { createCallerFactory, createTRPCRouter } from '@/core/api/api.methods'

import { categoryRouter } from '@/module/category/category.api'
import { inventoryRouter } from '@/module/inventory/inventory.api'
import { productVariantRouter } from '@/module/product-variant/product-variant.api'
import { productRouter } from '@/module/product/product.api'
import { seriesRouter } from '@/module/series/series.api'
import { subcategoryRouter } from '@/module/subcategory/subcategory.api'

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  subcategory: subcategoryRouter,
  series: seriesRouter,
  product: productRouter,
  productVariant: productVariantRouter,
  inventory: inventoryRouter,  
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
