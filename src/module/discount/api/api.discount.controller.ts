import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type ValidateCodeControllerInput,
  type ValidateCodeControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.discount'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { discountService } from './api.discount.service'

export const discountController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await discountService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.DISCOUNT.GET.SUCCESS : MESSAGE.DISCOUNT.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:DISCOUNT:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.DISCOUNT.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await discountService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.DISCOUNT.GET_MANY.SUCCESS : MESSAGE.DISCOUNT.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:DISCOUNT:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.DISCOUNT.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  validateCode: async ({ input }: ValidateCodeControllerInput): ValidateCodeControllerOutput => {
    try {
      const output = await discountService.validateCode({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.DISCOUNT.VALIDATE_CODE.SUCCESS : MESSAGE.DISCOUNT.VALIDATE_CODE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:DISCOUNT:VALIDATE_CODE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.DISCOUNT.VALIDATE_CODE.ERROR,
        data: null,
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await discountService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.DISCOUNT.CREATE.SUCCESS : MESSAGE.DISCOUNT.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:DISCOUNT:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.DISCOUNT.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await discountService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.DISCOUNT.UPDATE.SUCCESS : MESSAGE.DISCOUNT.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:DISCOUNT:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.DISCOUNT.UPDATE.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await discountService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.DISCOUNT.DELETE.SUCCESS : MESSAGE.DISCOUNT.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:DISCOUNT:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.DISCOUNT.DELETE.ERROR,
        data: null,
      }
    }
  },
}
