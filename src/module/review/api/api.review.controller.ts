import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetProductReviewsControllerInput,
  type GetProductReviewsControllerOutput,
  type GetUserReviewsControllerInput,
  type GetUserReviewsControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.review'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { reviewService } from './api.review.service'

export const reviewController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await reviewService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.REVIEW.GET.SUCCESS : MESSAGE.REVIEW.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:REVIEW:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.REVIEW.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await reviewService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.REVIEW.GET_MANY.SUCCESS : MESSAGE.REVIEW.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:REVIEW:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.REVIEW.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  getProductReviews: async ({ input }: GetProductReviewsControllerInput): GetProductReviewsControllerOutput => {
    try {
      const output = await reviewService.getProductReviews({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length
          ? MESSAGE.REVIEW.GET_PRODUCT_REVIEWS.SUCCESS
          : MESSAGE.REVIEW.GET_PRODUCT_REVIEWS.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:REVIEW:GET_PRODUCT_REVIEWS:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.REVIEW.GET_PRODUCT_REVIEWS.ERROR,
        data: [],
      }
    }
  },

  getUserReviews: async ({ input }: GetUserReviewsControllerInput): GetUserReviewsControllerOutput => {
    try {
      const output = await reviewService.getUserReviews({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.REVIEW.GET_USER_REVIEWS.SUCCESS : MESSAGE.REVIEW.GET_USER_REVIEWS.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:REVIEW:GET_USER_REVIEWS:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.REVIEW.GET_USER_REVIEWS.ERROR,
        data: [],
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await reviewService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.REVIEW.CREATE.SUCCESS : MESSAGE.REVIEW.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:REVIEW:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.REVIEW.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await reviewService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.REVIEW.UPDATE.SUCCESS : MESSAGE.REVIEW.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:REVIEW:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.REVIEW.UPDATE.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await reviewService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.REVIEW.DELETE.SUCCESS : MESSAGE.REVIEW.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:REVIEW:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.REVIEW.DELETE.ERROR,
        data: null,
      }
    }
  },
}
