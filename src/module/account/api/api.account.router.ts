import { protectedProcedure } from '@/core/orpc/orpc.server'
import { accountContract } from '../dto/dto.account.contract'

export const accountRouter = protectedProcedure.router({
  account: {
    get: protectedProcedure
      .route({
        summary: 'Get an account by ID',
        description: 'Get an account by ID',
        path: '/account/get',
        method: 'GET',
        tags: ['Account'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(accountContract.get.input)
      .output(accountContract.get.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many accounts',
        description: 'Get many accounts',
        path: '/account/getMany',
        method: 'GET',
        tags: ['Account'],
        inputStructure: 'detailed',
      })
      .input(accountContract.getMany.input)
      .output(accountContract.getMany.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: [] })),
    create: protectedProcedure
      .route({
        summary: 'Create a new account',
        description: 'Create a new account',
        path: '/account/create',
        method: 'POST',
        tags: ['Account'],
        inputStructure: 'detailed',
      })
      .input(accountContract.create.input)
      .output(accountContract.create.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    update: protectedProcedure
      .route({
        summary: 'Update an account',
        description: 'Update an account',
        path: '/account/update',
        method: 'POST',
        tags: ['Account'],
        inputStructure: 'detailed',
      })
      .input(accountContract.update.input)
      .output(accountContract.update.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    delete: protectedProcedure
      .route({
        summary: 'Delete an account by ID',
        description: 'Delete an account by ID',
        path: '/account/delete',
        method: 'DELETE',
        tags: ['Account'],
        inputStructure: 'detailed',
      })
      .input(accountContract.delete.input)
      .output(accountContract.delete.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
  },
})
