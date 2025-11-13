import { categoryController } from './api.category.controller'
import { categoryContract } from '../dto/dto.category.contract'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'

export const categoryRouter = createTRPCRouter({
  get: publicProcedure
    .input(categoryContract.get.input)
    .output(categoryContract.get.output)
    .query(({ input }) => categoryController.get({ input })),

  getMany: publicProcedure
    .input(categoryContract.getMany.input)
    .output(categoryContract.getMany.output)
    .query(({ input }) => categoryController.getMany({ input })),

  getManyByTypes: publicProcedure
    .input(categoryContract.getManyByTypes.input)
    .output(categoryContract.getManyByTypes.output)
    .query(({ input }) => categoryController.getManyByTypes({ input })),

  getBySlug: publicProcedure
    .input(categoryContract.getBySlug.input)
    .output(categoryContract.getBySlug.output)
    .query(({ input }) => categoryController.getBySlug({ input })),

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

  restore: protectedProcedure
    .input(categoryContract.restore.input)
    .output(categoryContract.restore.output)
    .mutation(({ input }) => categoryController.restore({ input })),

  toggleVisibility: protectedProcedure
    .input(categoryContract.toggleVisibility.input)
    .output(categoryContract.toggleVisibility.output)
    .mutation(({ input }) => categoryController.toggleVisibility({ input })),

  toggleFeatured: protectedProcedure
    .input(categoryContract.toggleFeatured.input)
    .output(categoryContract.toggleFeatured.output)
    .mutation(({ input }) => categoryController.toggleFeatured({ input })),

  reorder: protectedProcedure
    .input(categoryContract.reorder.input)
    .output(categoryContract.reorder.output)
    .mutation(({ input }) => categoryController.reorder({ input })),

  search: protectedProcedure
    .input(categoryContract.search.input)
    .output(categoryContract.search.output)
    .query(({ input }) => categoryController.search({ input })),
})
