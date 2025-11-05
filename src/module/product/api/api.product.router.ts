import { productController } from './api.product.controller'
import { productContract } from '../dto/dto.product.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const productRouter = createTRPCRouter({
  get: protectedProcedure
    .input(productContract.get.input)
    .output(productContract.get.output)
    .query(({ input }) => productController.get({ input })),
  getMany: protectedProcedure
    .input(productContract.getMany.input)
    .output(productContract.getMany.output)
    .query(({ input }) => productController.getMany({ input })),
  create: protectedProcedure
    .input(productContract.create.input)
    .output(productContract.create.output)
    .mutation(({ input }) => productController.create({ input })),
  update: protectedProcedure
    .input(productContract.update.input)
    .output(productContract.update.output)
    .mutation(({ input }) => productController.update({ input })),
  delete: protectedProcedure
    .input(productContract.delete.input)
    .output(productContract.delete.output)
    .mutation(({ input }) => productController.delete({ input })),
})
