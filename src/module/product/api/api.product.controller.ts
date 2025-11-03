import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetWithDetailsControllerInput,
  type GetWithDetailsControllerOutput,
  type SearchProductsControllerInput,
  type SearchProductsControllerOutput,
  type GetProductsByCategoryControllerInput,
  type GetProductsByCategoryControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.product'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { productService } from './api.product.service'

export const productController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await productService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.PRODUCT.GET.SUCCESS : MESSAGE.PRODUCT.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.GET.ERROR,
        data: null,
      }
    }
  },

  getWithDetails: async ({ input }: GetWithDetailsControllerInput): GetWithDetailsControllerOutput => {
    try {
      const output = await productService.getWithDetails({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.PRODUCT.GET_WITH_DETAILS.SUCCESS : MESSAGE.PRODUCT.GET_WITH_DETAILS.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:GET_WITH_DETAILS:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.GET_WITH_DETAILS.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await productService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.PRODUCT.GET_MANY.SUCCESS : MESSAGE.PRODUCT.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  searchProducts: async ({ input }: SearchProductsControllerInput): SearchProductsControllerOutput => {
    try {
      const output = await productService.searchProducts({ body: input.body })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.PRODUCT.SEARCH_PRODUCTS.SUCCESS : MESSAGE.PRODUCT.SEARCH_PRODUCTS.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:SEARCH_PRODUCTS:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.SEARCH_PRODUCTS.ERROR,
        data: [],
      }
    }
  },

  getProductsByCategory: async ({
    input,
  }: GetProductsByCategoryControllerInput): GetProductsByCategoryControllerOutput => {
    try {
      const output = await productService.getProductsByCategory({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length
          ? MESSAGE.PRODUCT.GET_PRODUCTS_BY_CATEGORY.SUCCESS
          : MESSAGE.PRODUCT.GET_PRODUCTS_BY_CATEGORY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:GET_PRODUCTS_BY_CATEGORY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.GET_PRODUCTS_BY_CATEGORY.ERROR,
        data: [],
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await productService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.PRODUCT.CREATE.SUCCESS : MESSAGE.PRODUCT.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await productService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.PRODUCT.UPDATE.SUCCESS : MESSAGE.PRODUCT.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.UPDATE.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await productService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.PRODUCT.DELETE.SUCCESS : MESSAGE.PRODUCT.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:PRODUCT:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.PRODUCT.DELETE.ERROR,
        data: null,
      }
    }
  },
}
