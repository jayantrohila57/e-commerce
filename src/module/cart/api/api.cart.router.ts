import { cartController } from './api.cart.controller'
import { cartContract } from '../dto/dto.cart.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const cartRouter = createTRPCRouter({
  get: protectedProcedure
    .input(cartContract.get.input)
    .output(cartContract.get.output)
    .query(({ input }) => cartController.get({ input })),
  getMany: protectedProcedure
    .input(cartContract.getMany.input)
    .output(cartContract.getMany.output)
    .query(({ input }) => cartController.getMany({ input })),
  create: protectedProcedure
    .input(cartContract.create.input)
    .output(cartContract.create.output)
    .mutation(({ input }) => cartController.create({ input })),
  update: protectedProcedure
    .input(cartContract.update.input)
    .output(cartContract.update.output)
    .mutation(({ input }) => cartController.update({ input })),
  delete: protectedProcedure
    .input(cartContract.delete.input)
    .output(cartContract.delete.output)
    .mutation(({ input }) => cartController.delete({ input })),
})
