import { categoryController } from './api.category.controller'
import { categoryContract } from '../dto/dto.category.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const categoryRouter = createTRPCRouter({
  get: protectedProcedure
    .input(categoryContract.get.input)
    .output(categoryContract.get.output)
    .query(({ input }) => categoryController.get({ input })),
  getMany: protectedProcedure
    .input(categoryContract.getMany.input)
    .output(categoryContract.getMany.output)
    .query(({ input }) => categoryController.getMany({ input })),
  create: protectedProcedure
    .input(categoryContract.create.input)
    .output(categoryContract.create.output)
    .mutation(({ input }) => categoryController.create({ input })),
  update: protectedProcedure
    .input(categoryContract.update.input)
    .output(categoryContract.update.output)
    .mutation(({ input }) => categoryController.update({ input })),
  delete: protectedProcedure
    .input(categoryContract.delete.input)
    .output(categoryContract.delete.output)
    .mutation(({ input }) => categoryController.delete({ input })),
})
