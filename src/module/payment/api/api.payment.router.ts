import { protectedProcedure } from '@/core/orpc/orpc.server'
import { paymentContract } from '../dto/dto.payment.contract'

export const paymentRouter = protectedProcedure.router({
  payment: {
    get: protectedProcedure
      .route({
        summary: 'Get a payment by ID',
        description: 'Get a payment by ID',
        path: '/payment/get',
        method: 'GET',
        tags: ['Payment'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(paymentContract.get.input)
      .output(paymentContract.get.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many payments',
        description: 'Get many payments',
        path: '/payment/getMany',
        method: 'GET',
        tags: ['Payment'],
        inputStructure: 'detailed',
      })
      .input(paymentContract.getMany.input)
      .output(paymentContract.getMany.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: [] })),
    create: protectedProcedure
      .route({
        summary: 'Create a new payment',
        description: 'Create a new payment',
        path: '/payment/create',
        method: 'POST',
        tags: ['Payment'],
        inputStructure: 'detailed',
      })
      .input(paymentContract.create.input)
      .output(paymentContract.create.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    update: protectedProcedure
      .route({
        summary: 'Update a payment',
        description: 'Update a payment',
        path: '/payment/update',
        method: 'POST',
        tags: ['Payment'],
        inputStructure: 'detailed',
      })
      .input(paymentContract.update.input)
      .output(paymentContract.update.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a payment by ID',
        description: 'Delete a payment by ID',
        path: '/payment/delete',
        method: 'DELETE',
        tags: ['Payment'],
        inputStructure: 'detailed',
      })
      .input(paymentContract.delete.input)
      .output(paymentContract.delete.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
  },
})
