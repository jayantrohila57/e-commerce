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
} from '../dto/types.category'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { categoryService } from './api.category.service'

export const categoryController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await categoryService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CATEGORY.GET.SUCCESS : MESSAGE.CATEGORY.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CATEGORY:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CATEGORY.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await categoryService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.CATEGORY.GET_MANY.SUCCESS : MESSAGE.CATEGORY.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:CATEGORY:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CATEGORY.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await categoryService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CATEGORY.CREATE.SUCCESS : MESSAGE.CATEGORY.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CATEGORY:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CATEGORY.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await categoryService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CATEGORY.UPDATE.SUCCESS : MESSAGE.CATEGORY.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CATEGORY:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CATEGORY.UPDATE.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await categoryService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CATEGORY.DELETE.SUCCESS : MESSAGE.CATEGORY.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CATEGORY:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CATEGORY.DELETE.ERROR,
        data: null,
      }
    }
  },
}
