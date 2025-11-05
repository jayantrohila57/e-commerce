import { orderController } from './api.order.controller'
import { orderContract } from '../dto/dto.order.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const orderRouter = createTRPCRouter({
  get: protectedProcedure
    .input(orderContract.get.input)
    .output(orderContract.get.output)
    .query(({ input }) => orderController.get({ input })),
  getMany: protectedProcedure
    .input(orderContract.getMany.input)
    .output(orderContract.getMany.output)
    .query(({ input }) => orderController.getMany({ input })),
  create: protectedProcedure
    .input(orderContract.create.input)
    .output(orderContract.create.output)
    .mutation(({ input }) => orderController.create({ input })),
  update: protectedProcedure
    .input(orderContract.update.input)
    .output(orderContract.update.output)
    .mutation(({ input }) => orderController.update({ input })),
  delete: protectedProcedure
    .input(orderContract.delete.input)
    .output(orderContract.delete.output)
    .mutation(({ input }) => orderController.delete({ input })),
})
