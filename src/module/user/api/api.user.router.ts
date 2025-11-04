import { protectedProcedure } from '@/core/orpc/orpc.server'
import { userController } from './api.user.controller'
import { userContract } from '../dto/dto.user.contract'

export const userRouter = protectedProcedure.router({
  user: {
    get: protectedProcedure
      .route({
        summary: 'Get a user by ID or other filter',
        description: 'Get a user by ID or other filter',
        path: '/user/get',
        method: 'POST',
        tags: ['User'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(userContract.get.input)
      .output(userContract.get.output)
      .handler(({ input }) => userController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many users',
        description: 'Get many users',
        path: '/user/getMany',
        method: 'POST',
        tags: ['User'],
        inputStructure: 'detailed',
      })
      .input(userContract.getMany.input)
      .output(userContract.getMany.output)
      .handler(({ input }) => userController.getMany({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new user',
        description: 'Create a new user',
        path: '/user/create',
        method: 'POST',
        tags: ['User'],
        inputStructure: 'detailed',
      })
      .input(userContract.create.input)
      .output(userContract.create.output)
      .handler(({ input }) => userController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update a user',
        description: 'Update a user',
        path: '/user/update',
        method: 'POST',
        tags: ['User'],
        inputStructure: 'detailed',
      })
      .input(userContract.update.input)
      .output(userContract.update.output)
      .handler(({ input }) => userController.update({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a user by ID',
        description: 'Delete a user by ID',
        path: '/user/delete',
        method: 'DELETE',
        tags: ['User'],
        inputStructure: 'detailed',
      })
      .input(userContract.delete.input)
      .output(userContract.delete.output)
      .handler(({ input }) => userController.delete({ input })),
  },
})
