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
import { API_RESPONSE } from '@/shared/config/api.utils'

export const userController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await userService.get({ body: input.body, params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.USER.GET.SUCCESS : MESSAGE.USER.GET.FAILED,
        output,
      )
    } catch (err) {
      debugLog('SERVICE:USER:GET:ERROR', err)
      return API_RESPONSE(STATUS.ERROR, MESSAGE.USER.GET.ERROR, null)
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await userService.getMany({ body: input.body, params: input.params })
      return API_RESPONSE(
        output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        output?.length ? MESSAGE.USER.GET_MANY.SUCCESS : MESSAGE.USER.GET_MANY.FAILED,
        output ?? [],
      )
    } catch (err) {
      debugLog('SERVICE:USER:GET_MANY:ERROR', err)
      return API_RESPONSE(STATUS.ERROR, MESSAGE.USER.GET_MANY.ERROR, [])
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await userService.create({ body: input.body })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.USER.CREATE.SUCCESS : MESSAGE.USER.CREATE.FAILED,
        output,
      )
    } catch (err) {
      debugLog('SERVICE:USER:CREATE:ERROR', err)
      return API_RESPONSE(STATUS.ERROR, MESSAGE.USER.CREATE.ERROR, null)
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await userService.update({ body: input.body, params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.USER.UPDATE.SUCCESS : MESSAGE.USER.UPDATE.FAILED,
        output,
      )
    } catch (err) {
      debugLog('SERVICE:USER:UPDATE:ERROR', err)
      return API_RESPONSE(STATUS.ERROR, MESSAGE.USER.UPDATE.ERROR, null)
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await userService.delete({ params: input.params })
      return API_RESPONSE(
        output ? STATUS.SUCCESS : STATUS.FAILED,
        output ? MESSAGE.USER.DELETE.SUCCESS : MESSAGE.USER.DELETE.FAILED,
        output,
      )
    } catch (err) {
      debugLog('SERVICE:USER:DELETE:ERROR', err)
      return API_RESPONSE(STATUS.ERROR, MESSAGE.USER.DELETE.ERROR, null)
    }
  },
}
