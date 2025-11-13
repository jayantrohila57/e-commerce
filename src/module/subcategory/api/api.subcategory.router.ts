import { subcategoryController } from './api.subcategory.controller'
import { subcategoryContract } from '../dto/dto.subcategory.contract'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'

export const subcategoryRouter = createTRPCRouter({
  get: publicProcedure
    .input(subcategoryContract.get.input)
    .output(subcategoryContract.get.output)
    .query(({ input }) => subcategoryController.get({ input })),

  getMany: publicProcedure
    .input(subcategoryContract.getMany.input)
    .output(subcategoryContract.getMany.output)
    .query(({ input }) => subcategoryController.getMany({ input })),

  getBySlug: publicProcedure
    .input(subcategoryContract.getBySlug.input)
    .output(subcategoryContract.getBySlug.output)
    .query(({ input }) => subcategoryController.getBySlug({ input })),

  create: protectedProcedure
    .input(subcategoryContract.create.input)
    .output(subcategoryContract.create.output)
    .mutation(({ input }) => subcategoryController.create({ input })),

  update: protectedProcedure
    .input(subcategoryContract.update.input)
    .output(subcategoryContract.update.output)
    .mutation(({ input }) => subcategoryController.update({ input })),

  delete: protectedProcedure
    .input(subcategoryContract.delete.input)
    .output(subcategoryContract.delete.output)
    .mutation(({ input }) => subcategoryController.delete({ input })),

  restore: protectedProcedure
    .input(subcategoryContract.restore.input)
    .output(subcategoryContract.restore.output)
    .mutation(({ input }) => subcategoryController.restore({ input })),

  toggleVisibility: protectedProcedure
    .input(subcategoryContract.toggleVisibility.input)
    .output(subcategoryContract.toggleVisibility.output)
    .mutation(({ input }) => subcategoryController.toggleVisibility({ input })),

  toggleFeatured: protectedProcedure
    .input(subcategoryContract.toggleFeatured.input)
    .output(subcategoryContract.toggleFeatured.output)
    .mutation(({ input }) => subcategoryController.toggleFeatured({ input })),

  reorder: protectedProcedure
    .input(subcategoryContract.reorder.input)
    .output(subcategoryContract.reorder.output)
    .mutation(({ input }) => subcategoryController.reorder({ input })),

  search: protectedProcedure
    .input(subcategoryContract.search.input)
    .output(subcategoryContract.search.output)
    .query(({ input }) => subcategoryController.search({ input })),
})
