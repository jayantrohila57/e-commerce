import { createCallerFactory, createTRPCRouter } from '@/core/api/api.methods'
import { categoryRouter } from '@/module/category/api/api.category.router'
import { subcategoryRouter } from '@/module/subcategory/api/api.subcategory.router'
import { seriesRouter } from '@/module/series/api/api.series.router'
import { productRouter } from '@/module/product/api/api.product.router'

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  subcategory: subcategoryRouter,
  series: seriesRouter,
  product: productRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
