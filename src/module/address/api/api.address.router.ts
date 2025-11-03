import { protectedProcedure } from '@/core/orpc/orpc.server'
import { addressController } from './api.address.controller'
import { addressContract } from '../dto/dto.address.contract'

export const addressRouter = protectedProcedure.router({
  address: {
    get: protectedProcedure
      .route({
        summary: 'Get an address by ID',
        description: 'Get an address by ID',
        path: '/address/get',
        method: 'GET',
        tags: ['Address'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(addressContract.get.input)
      .output(addressContract.get.output)
      .handler(({ input }) => addressController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many addresses',
        description: 'Get many addresses',
        path: '/address/getMany',
        method: 'GET',
        tags: ['Address'],
        inputStructure: 'detailed',
      })
      .input(addressContract.getMany.input)
      .output(addressContract.getMany.output)
      .handler(({ input }) => addressController.getMany({ input })),
    getUserAddresses: protectedProcedure
      .route({
        summary: 'Get all addresses for a user',
        description: 'Get all addresses for a specific user',
        path: '/address/getUserAddresses',
        method: 'GET',
        tags: ['Address'],
        inputStructure: 'detailed',
      })
      .input(addressContract.getUserAddresses.input)
      .output(addressContract.getUserAddresses.output)
      .handler(({ input }) => addressController.getUserAddresses({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new address',
        description: 'Create a new address',
        path: '/address/create',
        method: 'POST',
        tags: ['Address'],
        inputStructure: 'detailed',
      })
      .input(addressContract.create.input)
      .output(addressContract.create.output)
      .handler(({ input }) => addressController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update an address',
        description: 'Update an address',
        path: '/address/update',
        method: 'POST',
        tags: ['Address'],
        inputStructure: 'detailed',
      })
      .input(addressContract.update.input)
      .output(addressContract.update.output)
      .handler(({ input }) => addressController.update({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete an address by ID',
        description: 'Delete an address by ID',
        path: '/address/delete',
        method: 'DELETE',
        tags: ['Address'],
        inputStructure: 'detailed',
      })
      .input(addressContract.delete.input)
      .output(addressContract.delete.output)
      .handler(({ input }) => addressController.delete({ input })),
  },
})
