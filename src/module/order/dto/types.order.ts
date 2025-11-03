import { type orderContract } from './dto.order.contract'
import type z from 'zod'

export type GetOrderInput = z.infer<typeof orderContract.get.input>
export type GetOrderOutput = z.infer<typeof orderContract.get.output>

export type GetOrdersInput = z.infer<typeof orderContract.getMany.input>
export type GetOrdersOutput = z.infer<typeof orderContract.getMany.output>

export type GetUserOrdersInput = z.infer<typeof orderContract.getUserOrders.input>
export type GetUserOrdersOutput = z.infer<typeof orderContract.getUserOrders.output>

export type GetOrderWithItemsInput = z.infer<typeof orderContract.getOrderWithItems.input>
export type GetOrderWithItemsOutput = z.infer<typeof orderContract.getOrderWithItems.output>

export type CreateOrderInput = z.infer<typeof orderContract.create.input>
export type CreateOrderOutput = z.infer<typeof orderContract.create.output>

export type UpdateOrderInput = z.infer<typeof orderContract.update.input>
export type UpdateOrderOutput = z.infer<typeof orderContract.update.output>

export type CancelOrderInput = z.infer<typeof orderContract.cancelOrder.input>
export type CancelOrderOutput = z.infer<typeof orderContract.cancelOrder.output>

export type DeleteOrderInput = z.infer<typeof orderContract.delete.input>
export type DeleteOrderOutput = z.infer<typeof orderContract.delete.output>

export type GetControllerInput = { input: GetOrderInput }
export type GetControllerOutput = Promise<GetOrderOutput>

export type GetManyControllerInput = { input: GetOrdersInput }
export type GetManyControllerOutput = Promise<GetOrdersOutput>

export type GetUserOrdersControllerInput = { input: GetUserOrdersInput }
export type GetUserOrdersControllerOutput = Promise<GetUserOrdersOutput>

export type GetOrderWithItemsControllerInput = { input: GetOrderWithItemsInput }
export type GetOrderWithItemsControllerOutput = Promise<GetOrderWithItemsOutput>

export type CreateControllerInput = { input: CreateOrderInput }
export type CreateControllerOutput = Promise<CreateOrderOutput>

export type UpdateControllerInput = { input: UpdateOrderInput }
export type UpdateControllerOutput = Promise<UpdateOrderOutput>

export type CancelOrderControllerInput = { input: CancelOrderInput }
export type CancelOrderControllerOutput = Promise<CancelOrderOutput>

export type DeleteControllerInput = { input: DeleteOrderInput }
export type DeleteControllerOutput = Promise<DeleteOrderOutput>

export type GetServiceInput = { body: GetOrderInput['body']; params: GetOrderInput['params'] }
export type GetServiceOutput = Promise<GetOrderOutput['data'] | null>

export type GetManyServiceInput = { body: GetOrdersInput['body']; params: GetOrdersInput['params'] }
export type GetManyServiceOutput = Promise<GetOrdersOutput['data'] | null>

export type GetUserOrdersServiceInput = { body: GetUserOrdersInput['body']; params: GetUserOrdersInput['params'] }
export type GetUserOrdersServiceOutput = Promise<GetUserOrdersOutput['data'] | null>

export type GetOrderWithItemsServiceInput = { params: GetOrderWithItemsInput['params'] }
export type GetOrderWithItemsServiceOutput = Promise<GetOrderWithItemsOutput['data'] | null>

export type CreateServiceInput = { body: CreateOrderInput['body'] }
export type CreateServiceOutput = Promise<CreateOrderOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateOrderInput['body']; params: UpdateOrderInput['params'] }
export type UpdateServiceOutput = Promise<UpdateOrderOutput['data'] | null>

export type CancelOrderServiceInput = { params: CancelOrderInput['params'] }
export type CancelOrderServiceOutput = Promise<CancelOrderOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteOrderInput['params'] }
export type DeleteServiceOutput = Promise<DeleteOrderOutput['data'] | null>
