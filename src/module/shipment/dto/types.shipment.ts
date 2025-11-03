import { type shipmentContract } from './dto.shipment.contract'
import type z from 'zod'

export type GetShipmentInput = z.infer<typeof shipmentContract.get.input>
export type GetShipmentOutput = z.infer<typeof shipmentContract.get.output>

export type GetShipmentsInput = z.infer<typeof shipmentContract.getMany.input>
export type GetShipmentsOutput = z.infer<typeof shipmentContract.getMany.output>

export type GetOrderShipmentsInput = z.infer<typeof shipmentContract.getOrderShipments.input>
export type GetOrderShipmentsOutput = z.infer<typeof shipmentContract.getOrderShipments.output>

export type CreateShipmentInput = z.infer<typeof shipmentContract.create.input>
export type CreateShipmentOutput = z.infer<typeof shipmentContract.create.output>

export type UpdateShipmentInput = z.infer<typeof shipmentContract.update.input>
export type UpdateShipmentOutput = z.infer<typeof shipmentContract.update.output>

export type UpdateTrackingInput = z.infer<typeof shipmentContract.updateTracking.input>
export type UpdateTrackingOutput = z.infer<typeof shipmentContract.updateTracking.output>

export type DeleteShipmentInput = z.infer<typeof shipmentContract.delete.input>
export type DeleteShipmentOutput = z.infer<typeof shipmentContract.delete.output>

export type GetControllerInput = { input: GetShipmentInput }
export type GetControllerOutput = Promise<GetShipmentOutput>

export type GetManyControllerInput = { input: GetShipmentsInput }
export type GetManyControllerOutput = Promise<GetShipmentsOutput>

export type GetOrderShipmentsControllerInput = { input: GetOrderShipmentsInput }
export type GetOrderShipmentsControllerOutput = Promise<GetOrderShipmentsOutput>

export type CreateControllerInput = { input: CreateShipmentInput }
export type CreateControllerOutput = Promise<CreateShipmentOutput>

export type UpdateControllerInput = { input: UpdateShipmentInput }
export type UpdateControllerOutput = Promise<UpdateShipmentOutput>

export type UpdateTrackingControllerInput = { input: UpdateTrackingInput }
export type UpdateTrackingControllerOutput = Promise<UpdateTrackingOutput>

export type DeleteControllerInput = { input: DeleteShipmentInput }
export type DeleteControllerOutput = Promise<DeleteShipmentOutput>

export type GetServiceInput = { body: GetShipmentInput['body']; params: GetShipmentInput['params'] }
export type GetServiceOutput = Promise<GetShipmentOutput['data'] | null>

export type GetManyServiceInput = { body: GetShipmentsInput['body']; params: GetShipmentsInput['params'] }
export type GetManyServiceOutput = Promise<GetShipmentsOutput['data'] | null>

export type GetOrderShipmentsServiceInput = { params: GetOrderShipmentsInput['params'] }
export type GetOrderShipmentsServiceOutput = Promise<GetOrderShipmentsOutput['data'] | null>

export type CreateServiceInput = { body: CreateShipmentInput['body'] }
export type CreateServiceOutput = Promise<CreateShipmentOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateShipmentInput['body']; params: UpdateShipmentInput['params'] }
export type UpdateServiceOutput = Promise<UpdateShipmentOutput['data'] | null>

export type UpdateTrackingServiceInput = { body: UpdateTrackingInput['body']; params: UpdateTrackingInput['params'] }
export type UpdateTrackingServiceOutput = Promise<UpdateTrackingOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteShipmentInput['params'] }
export type DeleteServiceOutput = Promise<DeleteShipmentOutput['data'] | null>
