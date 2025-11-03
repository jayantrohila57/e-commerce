import { protectedProcedure } from '@/core/orpc/orpc.server'
import { verificationContract } from '../dto/dto.verification.contract'

export const verificationRouter = protectedProcedure.router({
  verification: {
    get: protectedProcedure
      .route({
        summary: 'Get a verification by ID',
        description: 'Get a verification by ID',
        path: '/verification/get',
        method: 'GET',
        tags: ['Verification'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(verificationContract.get.input)
      .output(verificationContract.get.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many verifications',
        description: 'Get many verifications',
        path: '/verification/getMany',
        method: 'GET',
        tags: ['Verification'],
        inputStructure: 'detailed',
      })
      .input(verificationContract.getMany.input)
      .output(verificationContract.getMany.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: [] })),
    create: protectedProcedure
      .route({
        summary: 'Create a new verification',
        description: 'Create a new verification',
        path: '/verification/create',
        method: 'POST',
        tags: ['Verification'],
        inputStructure: 'detailed',
      })
      .input(verificationContract.create.input)
      .output(verificationContract.create.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    update: protectedProcedure
      .route({
        summary: 'Update a verification',
        description: 'Update a verification',
        path: '/verification/update',
        method: 'POST',
        tags: ['Verification'],
        inputStructure: 'detailed',
      })
      .input(verificationContract.update.input)
      .output(verificationContract.update.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a verification by ID',
        description: 'Delete a verification by ID',
        path: '/verification/delete',
        method: 'DELETE',
        tags: ['Verification'],
        inputStructure: 'detailed',
      })
      .input(verificationContract.delete.input)
      .output(verificationContract.delete.output)
      .handler(async () => ({ status: 'error', message: 'Not implemented', data: null })),
  },
})
