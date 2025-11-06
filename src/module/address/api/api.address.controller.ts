import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetUserAddressesControllerInput,
  type GetUserAddressesControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.address'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { addressService } from './api.address.service'

export const addressController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await addressService.get(input.params)
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ADDRESS.GET.SUCCESS : MESSAGE.ADDRESS.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ADDRESS:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ADDRESS.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await addressService.getMany(input?.query)
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ADDRESS.GET_MANY.SUCCESS : MESSAGE.ADDRESS.GET_MANY.FAILED,
        data: output ?? {
          data: [],
          total: 0,
          limit: 0,
          offset: 0,
        },
      }
    } catch (err) {
      debugLog('CONTROLLER:ADDRESS:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ADDRESS.GET_MANY.ERROR,
        data: {
          data: [],
          total: 0,
          limit: 0,
          offset: 0,
        },
      }
    }
  },

  getUserAddresses: async ({ input }: GetUserAddressesControllerInput): GetUserAddressesControllerOutput => {
    try {
      const output = await addressService.getUserAddresses(input.params)
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length
          ? MESSAGE.ADDRESS.GET_USER_ADDRESSES.SUCCESS
          : MESSAGE.ADDRESS.GET_USER_ADDRESSES.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:ADDRESS:GET_USER_ADDRESSES:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ADDRESS.GET_USER_ADDRESSES.ERROR,
        data: [],
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await addressService.create(input.body)
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ADDRESS.CREATE.SUCCESS : MESSAGE.ADDRESS.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ADDRESS:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ADDRESS.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await addressService.update({
        id: input.params.id,
        update: input.body,
      })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ADDRESS.UPDATE.SUCCESS : MESSAGE.ADDRESS.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ADDRESS:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ADDRESS.UPDATE.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await addressService.delete(input.params)
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ADDRESS.DELETE.SUCCESS : MESSAGE.ADDRESS.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ADDRESS:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ADDRESS.DELETE.ERROR,
        data: null,
      }
    }
  },
}
