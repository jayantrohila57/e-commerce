import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetUserCartControllerInput,
  type GetUserCartControllerOutput,
  type AddItemControllerInput,
  type AddItemControllerOutput,
  type UpdateItemControllerInput,
  type UpdateItemControllerOutput,
  type RemoveItemControllerInput,
  type RemoveItemControllerOutput,
  type ClearCartControllerInput,
  type ClearCartControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.cart'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { cartService } from './api.cart.service'

export const cartController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await cartService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.GET.SUCCESS : MESSAGE.CART.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await cartService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.CART.GET_MANY.SUCCESS : MESSAGE.CART.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  getUserCart: async ({ input }: GetUserCartControllerInput): GetUserCartControllerOutput => {
    try {
      const output = await cartService.getUserCart({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.GET_USER_CART.SUCCESS : MESSAGE.CART.GET_USER_CART.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:GET_USER_CART:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.GET_USER_CART.ERROR,
        data: null,
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await cartService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.CREATE.SUCCESS : MESSAGE.CART.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.CREATE.ERROR,
        data: null,
      }
    }
  },

  addItem: async ({ input }: AddItemControllerInput): AddItemControllerOutput => {
    try {
      const output = await cartService.addItem({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.ADD_ITEM.SUCCESS : MESSAGE.CART.ADD_ITEM.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:ADD_ITEM:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.ADD_ITEM.ERROR,
        data: null,
      }
    }
  },

  updateItem: async ({ input }: UpdateItemControllerInput): UpdateItemControllerOutput => {
    try {
      const output = await cartService.updateItem({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.UPDATE_ITEM.SUCCESS : MESSAGE.CART.UPDATE_ITEM.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:UPDATE_ITEM:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.UPDATE_ITEM.ERROR,
        data: null,
      }
    }
  },

  removeItem: async ({ input }: RemoveItemControllerInput): RemoveItemControllerOutput => {
    try {
      const output = await cartService.removeItem({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.REMOVE_ITEM.SUCCESS : MESSAGE.CART.REMOVE_ITEM.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:REMOVE_ITEM:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.REMOVE_ITEM.ERROR,
        data: null,
      }
    }
  },

  clearCart: async ({ input }: ClearCartControllerInput): ClearCartControllerOutput => {
    try {
      const output = await cartService.clearCart({ params: input.params })
      if (!output) {
        return {
          status: STATUS.FAILED,
          message: MESSAGE.CART.CLEAR_CART.FAILED,
          data: { cartId: input.params.cartId, cleared: false },
        }
      }
      return {
        status: output.cleared ? STATUS.SUCCESS : STATUS.FAILED,
        message: output.cleared ? MESSAGE.CART.CLEAR_CART.SUCCESS : MESSAGE.CART.CLEAR_CART.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:CLEAR_CART:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.CLEAR_CART.ERROR,
        data: { cartId: input.params.cartId, cleared: false },
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await cartService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.UPDATE.SUCCESS : MESSAGE.CART.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.UPDATE.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await cartService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.CART.DELETE.SUCCESS : MESSAGE.CART.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:CART:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.CART.DELETE.ERROR,
        data: null,
      }
    }
  },
}
