import { protectedProcedure } from '@/core/orpc/orpc.server'
import { categoryController } from './api.category.controller'
import { categoryContract } from '../dto/dto.category.contract'

export const categoryRouter = protectedProcedure.router({
  category: {
    get: protectedProcedure
      .route({
        summary: 'Get a category by ID or slug',
        description: 'Get a category by ID or slug',
        path: '/category/get',
        method: 'GET',
        tags: ['Category'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(categoryContract.get.input)
      .output(categoryContract.get.output)
      .handler(({ input }) => categoryController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many categories',
        description: 'Get many categories',
        path: '/category/getMany',
        method: 'GET',
        tags: ['Category'],
        inputStructure: 'detailed',
      })
      .input(categoryContract.getMany.input)
      .output(categoryContract.getMany.output)
      .handler(({ input }) => categoryController.getMany({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new category',
        description: 'Create a new category',
        path: '/category/create',
        method: 'POST',
        tags: ['Category'],
        inputStructure: 'detailed',
      })
      .input(categoryContract.create.input)
      .output(categoryContract.create.output)
      .handler(({ input }) => categoryController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update a category',
        description: 'Update a category',
        path: '/category/update',
        method: 'POST',
        tags: ['Category'],
        inputStructure: 'detailed',
      })
      .input(categoryContract.update.input)
      .output(categoryContract.update.output)
      .handler(({ input }) => categoryController.update({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a category by ID',
        description: 'Delete a category by ID',
        path: '/category/delete',
        method: 'DELETE',
        tags: ['Category'],
        inputStructure: 'detailed',
      })
      .input(categoryContract.delete.input)
      .output(categoryContract.delete.output)
      .handler(({ input }) => categoryController.delete({ input })),
  },
})
