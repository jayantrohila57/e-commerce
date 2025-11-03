import { protectedProcedure } from '@/core/orpc/orpc.server'
import { shipmentController } from './api.shipment.controller'
import { shipmentContract } from '../dto/dto.shipment.contract'

export const shipmentRouter = protectedProcedure.router({
  shipment: {
    get: protectedProcedure
      .route({
        summary: 'Get a shipment by ID',
        description: 'Get a shipment by ID',
        path: '/shipment/get',
        method: 'GET',
        tags: ['Shipment'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(shipmentContract.get.input)
      .output(shipmentContract.get.output)
      .handler(({ input }) => shipmentController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many shipments',
        description: 'Get many shipments',
        path: '/shipment/getMany',
        method: 'GET',
        tags: ['Shipment'],
        inputStructure: 'detailed',
      })
      .input(shipmentContract.getMany.input)
      .output(shipmentContract.getMany.output)
      .handler(({ input }) => shipmentController.getMany({ input })),
    getOrderShipments: protectedProcedure
      .route({
        summary: 'Get all shipments for an order',
        description: 'Get all shipments for a specific order',
        path: '/shipment/getOrderShipments',
        method: 'GET',
        tags: ['Shipment'],
        inputStructure: 'detailed',
      })
      .input(shipmentContract.getOrderShipments.input)
      .output(shipmentContract.getOrderShipments.output)
      .handler(({ input }) => shipmentController.getOrderShipments({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new shipment',
        description: 'Create a new shipment',
        path: '/shipment/create',
        method: 'POST',
        tags: ['Shipment'],
        inputStructure: 'detailed',
      })
      .input(shipmentContract.create.input)
      .output(shipmentContract.create.output)
      .handler(({ input }) => shipmentController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update a shipment',
        description: 'Update a shipment',
        path: '/shipment/update',
        method: 'POST',
        tags: ['Shipment'],
        inputStructure: 'detailed',
      })
      .input(shipmentContract.update.input)
      .output(shipmentContract.update.output)
      .handler(({ input }) => shipmentController.update({ input })),
    updateTracking: protectedProcedure
      .route({
        summary: 'Update shipment tracking information',
        description: 'Update tracking number and carrier for a shipment',
        path: '/shipment/updateTracking',
        method: 'POST',
        tags: ['Shipment'],
        inputStructure: 'detailed',
      })
      .input(shipmentContract.updateTracking.input)
      .output(shipmentContract.updateTracking.output)
      .handler(({ input }) => shipmentController.updateTracking({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a shipment by ID',
        description: 'Delete a shipment by ID',
        path: '/shipment/delete',
        method: 'DELETE',
        tags: ['Shipment'],
        inputStructure: 'detailed',
      })
      .input(shipmentContract.delete.input)
      .output(shipmentContract.delete.output)
      .handler(({ input }) => shipmentController.delete({ input })),
  },
})
