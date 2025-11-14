import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'

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
} from './types.series'

import { seriesService } from './api.series.service'

export const seriesController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await seriesService.get({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.GET.SUCCESS : MESSAGE.SERIES.GET.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.GET.ERROR, null, err as Error)
    }
  },

  getBySlug: async ({ input }: GetBySlugControllerInput): GetBySlugControllerOutput => {
    try {
      const output = await seriesService.getBySlug({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? 'Series retrieved successfully.' : 'Series not found.',
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, 'Unexpected error while retrieving series by slug.', null, err as Error)
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await seriesService.getMany({ query: input.query })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.SERIES.GET_MANY.SUCCESS : MESSAGE.SERIES.GET_MANY.FAILED,
        output ?? [],
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.GET_MANY.ERROR, [], err as Error)
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await seriesService.create({ body: input.body })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.CREATE.SUCCESS : MESSAGE.SERIES.CREATE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.CREATE.ERROR, null, err as Error)
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await seriesService.update({ body: input.body, params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.UPDATE.SUCCESS : MESSAGE.SERIES.UPDATE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.UPDATE.ERROR, null, err as Error)
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await seriesService.delete({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.DELETE.SUCCESS : MESSAGE.SERIES.DELETE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.DELETE.ERROR, null, err as Error)
    }
  },

  restore: async ({ input }: RestoreControllerInput): RestoreControllerOutput => {
    try {
      const output = await seriesService.restore({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.RESTORE.SUCCESS : MESSAGE.SERIES.RESTORE.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.RESTORE.ERROR, null, err as Error)
    }
  },

  toggleVisibility: async ({ input }: ToggleVisibilityControllerInput): ToggleVisibilityControllerOutput => {
    try {
      const output = await seriesService.toggleVisibility({
        params: input.params,
        body: input.body,
      })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.TOGGLE_VISIBILITY.SUCCESS : MESSAGE.SERIES.TOGGLE_VISIBILITY.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.TOGGLE_VISIBILITY.ERROR, null, err as Error)
    }
  },

  toggleFeatured: async ({ input }: ToggleFeaturedControllerInput): ToggleFeaturedControllerOutput => {
    try {
      const output = await seriesService.toggleFeatured({
        params: input.params,
        body: input.body,
      })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.TOGGLE_FEATURED.SUCCESS : MESSAGE.SERIES.TOGGLE_FEATURED.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.TOGGLE_FEATURED.ERROR, null, err as Error)
    }
  },

  reorder: async ({ input }: ReorderControllerInput): ReorderControllerOutput => {
    try {
      const output = await seriesService.reorder({ body: input.body })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.SERIES.REORDER.SUCCESS : MESSAGE.SERIES.REORDER.FAILED,
        output,
      )
    } catch (err) {
      return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.REORDER.ERROR, null, err as Error)
    }
  },
}
