import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetUserOrdersControllerInput,
  type GetUserOrdersControllerOutput,
  type GetOrderWithItemsControllerInput,
  type GetOrderWithItemsControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type CancelOrderControllerInput,
  type CancelOrderControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.order'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { orderService } from './api.order.service'

export const orderController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await orderService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ORDER.GET.SUCCESS : MESSAGE.ORDER.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await orderService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.ORDER.GET_MANY.SUCCESS : MESSAGE.ORDER.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  getUserOrders: async ({ input }: GetUserOrdersControllerInput): GetUserOrdersControllerOutput => {
    try {
      const output = await orderService.getUserOrders({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.ORDER.GET_USER_ORDERS.SUCCESS : MESSAGE.ORDER.GET_USER_ORDERS.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:GET_USER_ORDERS:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.GET_USER_ORDERS.ERROR,
        data: [],
      }
    }
  },

  getOrderWithItems: async ({ input }: GetOrderWithItemsControllerInput): GetOrderWithItemsControllerOutput => {
    try {
      const output = await orderService.getOrderWithItems({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ORDER.GET_ORDER_WITH_ITEMS.SUCCESS : MESSAGE.ORDER.GET_ORDER_WITH_ITEMS.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:GET_ORDER_WITH_ITEMS:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.GET_ORDER_WITH_ITEMS.ERROR,
        data: null,
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await orderService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ORDER.CREATE.SUCCESS : MESSAGE.ORDER.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await orderService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ORDER.UPDATE.SUCCESS : MESSAGE.ORDER.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.UPDATE.ERROR,
        data: null,
      }
    }
  },

  cancelOrder: async ({ input }: CancelOrderControllerInput): CancelOrderControllerOutput => {
    try {
      const output = await orderService.cancelOrder({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ORDER.CANCEL_ORDER.SUCCESS : MESSAGE.ORDER.CANCEL_ORDER.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:CANCEL_ORDER:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.CANCEL_ORDER.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await orderService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.ORDER.DELETE.SUCCESS : MESSAGE.ORDER.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:ORDER:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.ORDER.DELETE.ERROR,
        data: null,
      }
    }
  },
}
