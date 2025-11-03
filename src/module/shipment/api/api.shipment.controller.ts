import {
  type CreateControllerInput,
  type CreateControllerOutput,
  type DeleteControllerInput,
  type DeleteControllerOutput,
  type GetManyControllerInput,
  type GetManyControllerOutput,
  type GetOrderShipmentsControllerInput,
  type GetOrderShipmentsControllerOutput,
  type UpdateControllerInput,
  type UpdateControllerOutput,
  type UpdateTrackingControllerInput,
  type UpdateTrackingControllerOutput,
  type GetControllerInput,
  type GetControllerOutput,
} from '../dto/types.shipment'

import { debugLog } from '@/shared/utils/lib/logger.utils'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { shipmentService } from './api.shipment.service'

export const shipmentController = {
  get: async ({ input }: GetControllerInput): GetControllerOutput => {
    try {
      const output = await shipmentService.get({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.SHIPMENT.GET.SUCCESS : MESSAGE.SHIPMENT.GET.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:SHIPMENT:GET:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.SHIPMENT.GET.ERROR,
        data: null,
      }
    }
  },

  getMany: async ({ input }: GetManyControllerInput): GetManyControllerOutput => {
    try {
      const output = await shipmentService.getMany({ body: input.body, params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length ? MESSAGE.SHIPMENT.GET_MANY.SUCCESS : MESSAGE.SHIPMENT.GET_MANY.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:SHIPMENT:GET_MANY:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.SHIPMENT.GET_MANY.ERROR,
        data: [],
      }
    }
  },

  getOrderShipments: async ({ input }: GetOrderShipmentsControllerInput): GetOrderShipmentsControllerOutput => {
    try {
      const output = await shipmentService.getOrderShipments({ params: input.params })
      return {
        status: output?.length ? STATUS.SUCCESS : STATUS.FAILED,
        message: output?.length
          ? MESSAGE.SHIPMENT.GET_ORDER_SHIPMENTS.SUCCESS
          : MESSAGE.SHIPMENT.GET_ORDER_SHIPMENTS.FAILED,
        data: output ?? [],
      }
    } catch (err) {
      debugLog('CONTROLLER:SHIPMENT:GET_ORDER_SHIPMENTS:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.SHIPMENT.GET_ORDER_SHIPMENTS.ERROR,
        data: [],
      }
    }
  },

  create: async ({ input }: CreateControllerInput): CreateControllerOutput => {
    try {
      const output = await shipmentService.create({ body: input.body })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.SHIPMENT.CREATE.SUCCESS : MESSAGE.SHIPMENT.CREATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:SHIPMENT:CREATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.SHIPMENT.CREATE.ERROR,
        data: null,
      }
    }
  },

  update: async ({ input }: UpdateControllerInput): UpdateControllerOutput => {
    try {
      const output = await shipmentService.update({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.SHIPMENT.UPDATE.SUCCESS : MESSAGE.SHIPMENT.UPDATE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:SHIPMENT:UPDATE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.SHIPMENT.UPDATE.ERROR,
        data: null,
      }
    }
  },

  updateTracking: async ({ input }: UpdateTrackingControllerInput): UpdateTrackingControllerOutput => {
    try {
      const output = await shipmentService.updateTracking({ body: input.body, params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.SHIPMENT.UPDATE_TRACKING.SUCCESS : MESSAGE.SHIPMENT.UPDATE_TRACKING.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:SHIPMENT:UPDATE_TRACKING:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.SHIPMENT.UPDATE_TRACKING.ERROR,
        data: null,
      }
    }
  },

  delete: async ({ input }: DeleteControllerInput): DeleteControllerOutput => {
    try {
      const output = await shipmentService.delete({ params: input.params })
      return {
        status: output ? STATUS.SUCCESS : STATUS.FAILED,
        message: output ? MESSAGE.SHIPMENT.DELETE.SUCCESS : MESSAGE.SHIPMENT.DELETE.FAILED,
        data: output,
      }
    } catch (err) {
      debugLog('CONTROLLER:SHIPMENT:DELETE:ERROR', err)
      return {
        status: STATUS.ERROR,
        message: MESSAGE.SHIPMENT.DELETE.ERROR,
        data: null,
      }
    }
  },
}
