import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetUserWishlistControllerInput,
  type GetUserWishlistControllerOutput,
  type AddItemControllerInput,
  type AddItemControllerOutput,
  type RemoveItemControllerInput,
  type RemoveItemControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.wishlist'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { wishlistService } from './api.wishlist.service'

export const wishlistController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await wishlistService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.WISHLIST.GET.SUCCESS : MESSAGE.WISHLIST.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:WISHLIST:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.WISHLIST.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await wishlistService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.WISHLIST.GET_MANY.SUCCESS : MESSAGE.WISHLIST.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:WISHLIST:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.WISHLIST.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  getUserWishlist: async ({ input }: GetUserWishlistControllerInput): GetUserWishlistControllerOutput => {
    try {
      const output = await wishlistService.getUserWishlist({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.WISHLIST.GET_USER_WISHLIST.SUCCESS : MESSAGE.WISHLIST.GET_USER_WISHLIST.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:WISHLIST:GET_USER_WISHLIST:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.WISHLIST.GET_USER_WISHLIST.ERROR,
        data: null,
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await wishlistService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.WISHLIST.CREATE.SUCCESS : MESSAGE.WISHLIST.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:WISHLIST:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.WISHLIST.CREATE.ERROR,
        data: null,
      }
    }
  },

  addItem: async ({ input }: AddItemControllerInput): AddItemControllerOutput => {
    try {
      const output = await wishlistService.addItem({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.WISHLIST.ADD_ITEM.SUCCESS : MESSAGE.WISHLIST.ADD_ITEM.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:WISHLIST:ADD_ITEM:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.WISHLIST.ADD_ITEM.ERROR,
        data: null,
      }
    }
  },

  removeItem: async ({ input }: RemoveItemControllerInput): RemoveItemControllerOutput => {
    try {
      const output = await wishlistService.removeItem({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.WISHLIST.REMOVE_ITEM.SUCCESS : MESSAGE.WISHLIST.REMOVE_ITEM.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:WISHLIST:REMOVE_ITEM:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.WISHLIST.REMOVE_ITEM.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await wishlistService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.WISHLIST.DELETE.SUCCESS : MESSAGE.WISHLIST.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:WISHLIST:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.WISHLIST.DELETE.ERROR,
        data: null,
      }
    }
  },
}
