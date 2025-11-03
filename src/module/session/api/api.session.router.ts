import { protectedProcedure } from '@/core/orpc/orpc.server'
import { sessionContract } from '../dto/dto.session.contract'

export const sessionRouter = protectedProcedure.router({
  session: {
    get: protectedProcedure
      .route({
        summary: 'Get a session by ID',
        description: 'Get a session by ID',
        path: '/session/get',
        method: 'GET',
        tags: ['Session'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(sessionContract.get.input)
      .output(sessionContract.get.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many sessions',
        description: 'Get many sessions',
        path: '/session/getMany',
        method: 'GET',
        tags: ['Session'],
        inputStructure: 'detailed',
      })
      .input(sessionContract.getMany.input)
      .output(sessionContract.getMany.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: [] })),
    create: protectedProcedure
      .route({
        summary: 'Create a new session',
        description: 'Create a new session',
        path: '/session/create',
        method: 'POST',
        tags: ['Session'],
        inputStructure: 'detailed',
      })
      .input(sessionContract.create.input)
      .output(sessionContract.create.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    update: protectedProcedure
      .route({
        summary: 'Update a session',
        description: 'Update a session',
        path: '/session/update',
        method: 'POST',
        tags: ['Session'],
        inputStructure: 'detailed',
      })
      .input(sessionContract.update.input)
      .output(sessionContract.update.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a session by ID',
        description: 'Delete a session by ID',
        path: '/session/delete',
        method: 'DELETE',
        tags: ['Session'],
        inputStructure: 'detailed',
      })
      .input(sessionContract.delete.input)
      .output(sessionContract.delete.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
  },
})
