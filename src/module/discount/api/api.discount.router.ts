import { discountController } from './api.discount.controller'
import { discountContract } from '../dto/dto.discount.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const discountRouter = createTRPCRouter({
  get: protectedProcedure
    .input(discountContract.get.input)
    .output(discountContract.get.output)
    .query(({ input }) => discountController.get({ input })),
  getMany: protectedProcedure
    .input(discountContract.getMany.input)
    .output(discountContract.getMany.output)
    .query(({ input }) => discountController.getMany({ input })),
  create: protectedProcedure
    .input(discountContract.create.input)
    .output(discountContract.create.output)
    .mutation(({ input }) => discountController.create({ input })),
  update: protectedProcedure
    .input(discountContract.update.input)
    .output(discountContract.update.output)
    .mutation(({ input }) => discountController.update({ input })),
  delete: protectedProcedure
    .input(discountContract.delete.input)
    .output(discountContract.delete.output)
    .mutation(({ input }) => discountController.delete({ input })),
})
