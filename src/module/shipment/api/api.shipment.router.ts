import { shipmentController } from './api.shipment.controller'
import { shipmentContract } from '../dto/dto.shipment.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const shipmentRouter = createTRPCRouter({
  get: protectedProcedure
    .input(shipmentContract.get.input)
    .output(shipmentContract.get.output)
    .query(({ input }) => shipmentController.get({ input })),
  getMany: protectedProcedure
    .input(shipmentContract.getMany.input)
    .output(shipmentContract.getMany.output)
    .query(({ input }) => shipmentController.getMany({ input })),
  create: protectedProcedure
    .input(shipmentContract.create.input)
    .output(shipmentContract.create.output)
    .mutation(({ input }) => shipmentController.create({ input })),
  update: protectedProcedure
    .input(shipmentContract.update.input)
    .output(shipmentContract.update.output)
    .mutation(({ input }) => shipmentController.update({ input })),
  delete: protectedProcedure
    .input(shipmentContract.delete.input)
    .output(shipmentContract.delete.output)
    .mutation(({ input }) => shipmentController.delete({ input })),
})
