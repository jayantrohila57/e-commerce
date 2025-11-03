import { protectedProcedure } from '@/core/orpc/orpc.server'
import { orderController } from './api.order.controller'
import { orderContract } from '../dto/dto.order.contract'

export const orderRouter = protectedProcedure.router({
  order: {
    get: protectedProcedure
      .route({
        summary: 'Get an order by ID',
        description: 'Get an order by ID',
        path: '/order/get',
        method: 'GET',
        tags: ['Order'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(orderContract.get.input)
      .output(orderContract.get.output)
      .handler(({ input }) => orderController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many orders',
        description: 'Get many orders',
        path: '/order/getMany',
        method: 'GET',
        tags: ['Order'],
        inputStructure: 'detailed',
      })
      .input(orderContract.getMany.input)
      .output(orderContract.getMany.output)
      .handler(({ input }) => orderController.getMany({ input })),
    getUserOrders: protectedProcedure
      .route({
        summary: 'Get all orders for a user',
        description: 'Get all orders for a specific user',
        path: '/order/getUserOrders',
        method: 'GET',
        tags: ['Order'],
        inputStructure: 'detailed',
      })
      .input(orderContract.getUserOrders.input)
      .output(orderContract.getUserOrders.output)
      .handler(({ input }) => orderController.getUserOrders({ input })),
    getOrderWithItems: protectedProcedure
      .route({
        summary: 'Get order with items',
        description: 'Get an order by ID including all order items',
        path: '/order/getOrderWithItems',
        method: 'GET',
        tags: ['Order'],
        inputStructure: 'detailed',
      })
      .input(orderContract.getOrderWithItems.input)
      .output(orderContract.getOrderWithItems.output)
      .handler(({ input }) => orderController.getOrderWithItems({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new order',
        description: 'Create a new order',
        path: '/order/create',
        method: 'POST',
        tags: ['Order'],
        inputStructure: 'detailed',
      })
      .input(orderContract.create.input)
      .output(orderContract.create.output)
      .handler(({ input }) => orderController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update an order',
        description: 'Update an order status or details',
        path: '/order/update',
        method: 'POST',
        tags: ['Order'],
        inputStructure: 'detailed',
      })
      .input(orderContract.update.input)
      .output(orderContract.update.output)
      .handler(({ input }) => orderController.update({ input })),
    cancelOrder: protectedProcedure
      .route({
        summary: 'Cancel an order',
        description: 'Cancel an order by ID',
        path: '/order/cancelOrder',
        method: 'POST',
        tags: ['Order'],
        inputStructure: 'detailed',
      })
      .input(orderContract.cancelOrder.input)
      .output(orderContract.cancelOrder.output)
      .handler(({ input }) => orderController.cancelOrder({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete an order by ID',
        description: 'Delete an order by ID',
        path: '/order/delete',
        method: 'DELETE',
        tags: ['Order'],
        inputStructure: 'detailed',
      })
      .input(orderContract.delete.input)
      .output(orderContract.delete.output)
      .handler(({ input }) => orderController.delete({ input })),
  },
})
