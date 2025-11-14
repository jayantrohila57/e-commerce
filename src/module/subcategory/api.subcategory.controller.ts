import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
  type GetBySlugControllerInput,
  type GetBySlugControllerOutput,
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
} from './types.subcategory'

import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { subcategoryService } from './api.subcategory.service'
import { API_RESPONSE } from '@/shared/config/api.utils'

export const subcategoryController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await subcategoryService.get({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SUBCATEGORY.GET.SUCCESS : MESSAGE.SUBCATEGORY.GET.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET.ERROR, null, err as Error)
    }
  },

  getBySlug: async ({ input }: GetBySlugControllerInput): GetBySlugControllerOutput => {
    try {
      const output = await subcategoryService.getBySlug({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? 'Subcategory retrieved successfully.' : 'Subcategory not found.',
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, 'Unexpected error while retrieving subcategory by slug.', null, err as Error)
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await subcategoryService.getMany({ query: input.query })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.SUBCATEGORY.GET_MANY.SUCCESS : MESSAGE.SUBCATEGORY.GET_MANY.FAILED,
        output ?? [],
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.GET_MANY.ERROR, [], err as Error)
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await subcategoryService.create({ body: input.body })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SUBCATEGORY.CREATE.SUCCESS : MESSAGE.SUBCATEGORY.CREATE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.CREATE.ERROR, null, err as Error)
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await subcategoryService.update({ body: input.body, params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SUBCATEGORY.UPDATE.SUCCESS : MESSAGE.SUBCATEGORY.UPDATE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.UPDATE.ERROR, null, err as Error)
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await subcategoryService.delete({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SUBCATEGORY.DELETE.SUCCESS : MESSAGE.SUBCATEGORY.DELETE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.DELETE.ERROR, null, err as Error)
    }
  },

  restore: async ({ input }: RestoreControllerInput): RestoreControllerOutput => {
    try {
      const output = await subcategoryService.restore({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SUBCATEGORY.RESTORE.SUCCESS : MESSAGE.SUBCATEGORY.RESTORE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.RESTORE.ERROR, null, err as Error)
    }
  },

  toggleVisibility: async ({ input }: ToggleVisibilityControllerInput): ToggleVisibilityControllerOutput => {
    try {
      const output = await subcategoryService.toggleVisibility({
        params: input.params,
        body: input.body,
      })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SUBCATEGORY.TOGGLE_VISIBILITY.SUCCESS : MESSAGE.SUBCATEGORY.TOGGLE_VISIBILITY.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.TOGGLE_VISIBILITY.ERROR, null, err as Error)
    }
  },

  toggleFeatured: async ({ input }: ToggleFeaturedControllerInput): ToggleFeaturedControllerOutput => {
    try {
      const output = await subcategoryService.toggleFeatured({
        params: input.params,
        body: input.body,
      })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SUBCATEGORY.TOGGLE_FEATURED.SUCCESS : MESSAGE.SUBCATEGORY.TOGGLE_FEATURED.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.TOGGLE_FEATURED.ERROR, null, err as Error)
    }
  },

  reorder: async ({ input }: ReorderControllerInput): ReorderControllerOutput => {
    try {
      const output = await subcategoryService.reorder({ body: input.body })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.SUBCATEGORY.REORDER.SUCCESS : MESSAGE.SUBCATEGORY.REORDER.FAILED,
        output ?? [],
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.REORDER.ERROR, [], err as Error)
    }
  },

  search: async ({ input }: SearchControllerInput): SearchControllerOutput => {
    try {
      const output = await subcategoryService.search({ query: input.query })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.SUBCATEGORY.SEARCH.SUCCESS : MESSAGE.SUBCATEGORY.SEARCH.FAILED,
        output ?? [],
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SUBCATEGORY.SEARCH.ERROR, [], err as Error)
    }
  },
}
