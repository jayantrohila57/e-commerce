import { protectedProcedure } from '@/core/orpc/orpc.server'
import { reviewController } from './api.review.controller'
import { reviewContract } from '../dto/dto.review.contract'

export const reviewRouter = protectedProcedure.router({
  review: {
    get: protectedProcedure
      .route({
        summary: 'Get a review by ID',
        description: 'Get a review by ID',
        path: '/review/get',
        method: 'GET',
        tags: ['Review'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(reviewContract.get.input)
      .output(reviewContract.get.output)
      .handler(({ input }) => reviewController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many reviews',
        description: 'Get many reviews',
        path: '/review/getMany',
        method: 'GET',
        tags: ['Review'],
        inputStructure: 'detailed',
      })
      .input(reviewContract.getMany.input)
      .output(reviewContract.getMany.output)
      .handler(({ input }) => reviewController.getMany({ input })),
    getProductReviews: protectedProcedure
      .route({
        summary: 'Get all reviews for a product',
        description: 'Get all reviews for a specific product',
        path: '/review/getProductReviews',
        method: 'GET',
        tags: ['Review'],
        inputStructure: 'detailed',
      })
      .input(reviewContract.getProductReviews.input)
      .output(reviewContract.getProductReviews.output)
      .handler(({ input }) => reviewController.getProductReviews({ input })),
    getUserReviews: protectedProcedure
      .route({
        summary: 'Get all reviews by a user',
        description: 'Get all reviews created by a specific user',
        path: '/review/getUserReviews',
        method: 'GET',
        tags: ['Review'],
        inputStructure: 'detailed',
      })
      .input(reviewContract.getUserReviews.input)
      .output(reviewContract.getUserReviews.output)
      .handler(({ input }) => reviewController.getUserReviews({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new review',
        description: 'Create a new review',
        path: '/review/create',
        method: 'POST',
        tags: ['Review'],
        inputStructure: 'detailed',
      })
      .input(reviewContract.create.input)
      .output(reviewContract.create.output)
      .handler(({ input }) => reviewController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update a review',
        description: 'Update a review',
        path: '/review/update',
        method: 'POST',
        tags: ['Review'],
        inputStructure: 'detailed',
      })
      .input(reviewContract.update.input)
      .output(reviewContract.update.output)
      .handler(({ input }) => reviewController.update({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a review by ID',
        description: 'Delete a review by ID',
        path: '/review/delete',
        method: 'DELETE',
        tags: ['Review'],
        inputStructure: 'detailed',
      })
      .input(reviewContract.delete.input)
      .output(reviewContract.delete.output)
      .handler(({ input }) => reviewController.delete({ input })),
  },
})
