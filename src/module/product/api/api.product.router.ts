import { productContract } from '../dto/dto.product.contract'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { productController } from './api.product.controller'

export const productRouter = createTRPCRouter({
  get: publicProcedure
    .input(productContract.get.input)
    .output(productContract.get.output)
    .query(({ input }) => productController.get({ input })),

  getMany: publicProcedure
    .input(productContract.getMany.input)
    .output(productContract.getMany.output)
    .query(({ input }) => productController.getMany({ input })),

  getBySlug: publicProcedure
    .input(productContract.getBySlug.input)
    .output(productContract.getBySlug.output)
    .query(({ input }) => productController.getBySlug({ input })),

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

  search: protectedProcedure
    .input(productContract.search.input)
    .output(productContract.search.output)
    .query(({ input }) => productController.search({ input })),
})
