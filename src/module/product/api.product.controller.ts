import {
  CreateControllerInput,
  CreateControllerOutput,
  DeleteControllerInput,
  DeleteControllerOutput,
  GetControllerInput,
  GetControllerOutput,
  GetManyControllerInput,
  GetManyControllerOutput,
  GetProductWithSubcategoriesControllerInput,
  GetProductWithSubcategoriesControllerOutput,
  GetProductWithSubcategoriesInput,
  GetProductWithSubcategoriesOutput,
  SearchControllerInput,
  SearchControllerOutput,
  UpdateControllerInput,
  UpdateControllerOutput,
} from './dto.product.types'

import { debugError, debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { productService } from './api.product.service'

export const productController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await productService.get({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.PRODUCT.GET.SUCCESS : MESSAGE.PRODUCT.GET.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET.ERROR, null, err as Error)
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await productService.getMany({ query: input.query })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.PRODUCT.GET_MANY.SUCCESS : MESSAGE.PRODUCT.GET_MANY.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.GET_MANY.ERROR, null, err as Error)
    }
  },

  getBySlug: async ({
    input,
  }: GetProductWithSubcategoriesControllerInput): GetProductWithSubcategoriesControllerOutput => {
    try {
      const output = await productService.getBySlug({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.PRODUCT.GET_BY_SLUG.SUCCESS : MESSAGE.PRODUCT.GET_BY_SLUG.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_MANY.ERROR, null, err as Error)
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await productService.create({ body: input.body })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.PRODUCT.CREATE.SUCCESS : MESSAGE.PRODUCT.CREATE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.CREATE.ERROR, null, err as Error)
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await productService.update({
        body: input.body,
        params: input.params,
      })

      if (!output) {
        debugLog('CONTROLLER:PRODUCT:UPDATE:NOT_FOUND', { id: input.params.id })
        return API_RESPONSE(STATUS.FAILED, MESSAGE.PRODUCT.UPDATE.FAILED, null)
      }

      debugLog('CONTROLLER:PRODUCT:UPDATE:SUCCESS', { id: input.params.id })
      return API_RESPONSE(STATUS.SUCCESS, MESSAGE.PRODUCT.UPDATE.SUCCESS, output)
    } catch (err) {
      const error = err as Error
      debugError('CONTROLLER:PRODUCT:UPDATE:ERROR', {
        id: input?.params?.id,
        error: error.message,
      })
      return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.UPDATE.ERROR, null, error)
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await productService.delete({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.PRODUCT.DELETE.SUCCESS : MESSAGE.PRODUCT.DELETE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.DELETE.ERROR, null, err as Error)
    }
  },

  search: async ({ input }: SearchControllerInput): SearchControllerOutput => {
    try {
      const output = await productService.search({ query: input.query })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.PRODUCT.SEARCH.SUCCESS : MESSAGE.PRODUCT.SEARCH.FAILED,
        output ?? [],
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.PRODUCT.SEARCH.ERROR, [], err as Error)
    }
  },
}
