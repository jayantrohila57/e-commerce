import { seriesController } from './api.series.controller'
import { seriesContract } from '../dto/dto.series.contract'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'

export const seriesRouter = createTRPCRouter({
  // Get series by ID
  get: publicProcedure
    .input(seriesContract.get.input)
    .output(seriesContract.get.output)
    .query(({ input }) => seriesController.get({ input })),

  // Get series by slug
  getBySlug: publicProcedure
    .input(seriesContract.getBySlug.input)
    .output(seriesContract.getBySlug.output)
    .query(({ input }) => seriesController.getBySlug({ input })),

  // Get multiple series with filtering and pagination
  getMany: publicProcedure
    .input(seriesContract.getMany.input)
    .output(seriesContract.getMany.output)
    .query(({ input }) => seriesController.getMany({ input })),

  // Create a new series
  create: protectedProcedure
    .input(seriesContract.create.input)
    .output(seriesContract.create.output)
    .mutation(({ input }) => seriesController.create({ input })),

  // Update an existing series
  update: protectedProcedure
    .input(seriesContract.update.input)
    .output(seriesContract.update.output)
    .mutation(({ input }) => seriesController.update({ input })),

  // Soft delete a series
  delete: protectedProcedure
    .input(seriesContract.delete.input)
    .output(seriesContract.delete.output)
    .mutation(({ input }) => seriesController.delete({ input })),

  // Restore a soft-deleted series
  restore: protectedProcedure
    .input(seriesContract.restore.input)
    .output(seriesContract.restore.output)
    .mutation(({ input }) => seriesController.restore({ input })),

  // Toggle series visibility
  toggleVisibility: protectedProcedure
    .input(seriesContract.toggleVisibility.input)
    .output(seriesContract.toggleVisibility.output)
    .mutation(({ input }) => seriesController.toggleVisibility({ input })),

  // Toggle series featured status
  toggleFeatured: protectedProcedure
    .input(seriesContract.toggleFeatured.input)
    .output(seriesContract.toggleFeatured.output)
    .mutation(({ input }) => seriesController.toggleFeatured({ input })),

  // Reorder series
  reorder: protectedProcedure
    .input(seriesContract.reorder.input)
    .output(seriesContract.reorder.output)
    .mutation(({ input }) => seriesController.reorder({ input })),
})
