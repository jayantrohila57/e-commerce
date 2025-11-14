import { createCallerFactory, createTRPCRouter } from '@/core/api/api.methods'

import { categoryRouter } from '@/module/category/category.api'
import { seriesRouter } from '@/module/series/api.series.router'
import { productRouter } from '@/module/product/product.api'
import { subcategoryRouter } from '@/module/subcategory/subcategory.api'

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  subcategory: subcategoryRouter,
  series: seriesRouter,
  product: productRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
