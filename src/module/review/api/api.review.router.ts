import { reviewController } from './api.review.controller'
import { reviewContract } from '../dto/dto.review.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const reviewRouter = createTRPCRouter({
  get: protectedProcedure
    .input(reviewContract.get.input)
    .output(reviewContract.get.output)
    .query(({ input }) => reviewController.get({ input })),
  getMany: protectedProcedure
    .input(reviewContract.getMany.input)
    .output(reviewContract.getMany.output)
    .query(({ input }) => reviewController.getMany({ input })),
  create: protectedProcedure
    .input(reviewContract.create.input)
    .output(reviewContract.create.output)
    .mutation(({ input }) => reviewController.create({ input })),
  update: protectedProcedure
    .input(reviewContract.update.input)
    .output(reviewContract.update.output)
    .mutation(({ input }) => reviewController.update({ input })),
  delete: protectedProcedure
    .input(reviewContract.delete.input)
    .output(reviewContract.delete.output)
    .mutation(({ input }) => reviewController.delete({ input })),
})
