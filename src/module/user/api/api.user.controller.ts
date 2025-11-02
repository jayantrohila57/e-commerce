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
} from '../dto/types.user'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { userService } from './api.user.service'

export const userController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await userService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.USER.GET.SUCCESS : MESSAGE.USER.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('SERVICE:USER:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.USER.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await userService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.USER.GET_MANY.SUCCESS : MESSAGE.USER.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('SERVICE:USER:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.USER.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await userService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.USER.CREATE.SUCCESS : MESSAGE.USER.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('SERVICE:USER:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.USER.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await userService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.USER.UPDATE.SUCCESS : MESSAGE.USER.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('SERVICE:USER:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.USER.UPDATE.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await userService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.USER.DELETE.SUCCESS : MESSAGE.USER.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('SERVICE:USER:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.USER.DELETE.ERROR,
        data: null,
      }
    }
  },
}
