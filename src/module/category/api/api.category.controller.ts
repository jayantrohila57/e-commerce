import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetManyByTypesControllerInput,
  type GetManyByTypesControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
  type RestoreControllerInput,
  type RestoreControllerOutput,
  type ToggleVisibilityControllerInput,
  type ToggleVisibilityControllerOutput,
  type ToggleFeaturedControllerInput,
  type ToggleFeaturedControllerOutput,
  type ReorderControllerInput,
  type ReorderControllerOutput,
  type SearchControllerInput,
  type SearchControllerOutput,
  type GetCategoryWithSubcategoriesControllerInput,
  type GetCategoryWithSubcategoriesControllerOutput,
} from '../dto/types.category'

import { debugError, debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { categoryService } from './api.category.service'
import { API_RESPONSE } from '@/shared/config/api.utils'

export const categoryController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await categoryService.get({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.CATEGORY.GET.SUCCESS : MESSAGE.CATEGORY.GET.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET.ERROR, null, err as Error)
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await categoryService.getMany({ query: input.query })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.CATEGORY.GET_MANY.SUCCESS : MESSAGE.CATEGORY.GET_MANY.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_MANY.ERROR, null, err as Error)
    }
  },

  getManyByTypes: async ({ input }: GetManyByTypesControllerInput): GetManyByTypesControllerOutput => {
    try {
      const output = await categoryService.getManyByTypes({ query: input.query })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.CATEGORY.GET_MANY.SUCCESS : MESSAGE.CATEGORY.GET_MANY.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.GET_MANY.ERROR, null, err as Error)
    }
  },

  getBySlug: async ({
    input,
  }: GetCategoryWithSubcategoriesControllerInput): GetCategoryWithSubcategoriesControllerOutput => {
    try {
      const data = await categoryService.getBySlug({
        params: input.params,
      })

      return API_RESPONSE(
        data ? STATUS.SUCCESS : STATUS.FAILED,
        data ? 'Category and subcategories retrieved successfully.' : 'Category not found.',
        data,
      )
    } catch (err) {
      return API_RESPONSE(
        STATUS.ERROR,
        'Unexpected error while retrieving category with subcategories.',
        null,
        err as Error,
      )
    }
  },
  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await categoryService.create({ body: input.body })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.CATEGORY.CREATE.SUCCESS : MESSAGE.CATEGORY.CREATE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.CREATE.ERROR, null, err as Error)
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await categoryService.update({
        body: input.body,
        params: input.params,
      })

      if (!output) {
        debugLog('CONTROLLER:CATEGORY:UPDATE:NOT_FOUND', { id: input.params.id })
        return API_RESPONSE(STATUS.FAILED, MESSAGE.CATEGORY.UPDATE.FAILED, null)
      }

      debugLog('CONTROLLER:CATEGORY:UPDATE:SUCCESS', { id: input.params.id })
      return API_RESPONSE(STATUS.SUCCESS, MESSAGE.CATEGORY.UPDATE.SUCCESS, output)
    } catch (err) {
      const error = err as Error
      debugError('CONTROLLER:CATEGORY:UPDATE:ERROR', {
        id: input?.params?.id,
        error: error.message,
      })
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.UPDATE.ERROR, null, error)
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await categoryService.delete({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.CATEGORY.DELETE.SUCCESS : MESSAGE.CATEGORY.DELETE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.DELETE.ERROR, null, err as Error)
    }
  },

  restore: async ({ input }: RestoreControllerInput): RestoreControllerOutput => {
    try {
      const output = await categoryService.restore({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.CATEGORY.RESTORE.SUCCESS : MESSAGE.CATEGORY.RESTORE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.RESTORE.ERROR, null, err as Error)
    }
  },

  toggleVisibility: async ({ input }: ToggleVisibilityControllerInput): ToggleVisibilityControllerOutput => {
    try {
      const output = await categoryService.toggleVisibility({
        params: input.params,
        body: input.body,
      })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.CATEGORY.TOGGLE_VISIBILITY.SUCCESS : MESSAGE.CATEGORY.TOGGLE_VISIBILITY.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.TOGGLE_VISIBILITY.ERROR, null, err as Error)
    }
  },

  toggleFeatured: async ({ input }: ToggleFeaturedControllerInput): ToggleFeaturedControllerOutput => {
    try {
      const output = await categoryService.toggleFeatured({
        params: input.params,
        body: input.body,
      })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.CATEGORY.TOGGLE_FEATURED.SUCCESS : MESSAGE.CATEGORY.TOGGLE_FEATURED.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.TOGGLE_FEATURED.ERROR, null, err as Error)
    }
  },

  reorder: async ({ input }: ReorderControllerInput): ReorderControllerOutput => {
    try {
      const output = await categoryService.reorder({ body: input.body })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.CATEGORY.REORDER.SUCCESS : MESSAGE.CATEGORY.REORDER.FAILED,
        output ?? [],
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.REORDER.ERROR, [], err as Error)
    }
  },

  search: async ({ input }: SearchControllerInput): SearchControllerOutput => {
    try {
      const output = await categoryService.search({ query: input.query })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.CATEGORY.SEARCH.SUCCESS : MESSAGE.CATEGORY.SEARCH.FAILED,
        output ?? [],
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.CATEGORY.SEARCH.ERROR, [], err as Error)
    }
  },
}
