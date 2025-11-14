import { createCallerFactory, createTRPCRouter } from '@/core/api/api.methods'
import { categoryRouter } from '@/module/category/category.api'
import { subcategoryRouter } from '@/module/subcategory/api.subcategory.router'
import { seriesRouter } from '@/module/series/api.series.router'
import { productRouter } from '@/module/product/api.product.router'

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  subcategory: subcategoryRouter,
  series: seriesRouter,
  product: productRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
