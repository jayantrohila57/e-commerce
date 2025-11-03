import { protectedProcedure } from '@/core/orpc/orpc.server'
import { discountController } from './api.discount.controller'
import { discountContract } from '../dto/dto.discount.contract'

export const discountRouter = protectedProcedure.router({
  discount: {
    get: protectedProcedure
      .route({
        summary: 'Get a discount by ID or code',
        description: 'Get a discount by ID or code',
        path: '/discount/get',
        method: 'GET',
        tags: ['Discount'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(discountContract.get.input)
      .output(discountContract.get.output)
      .handler(({ input }) => discountController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many discounts',
        description: 'Get many discounts',
        path: '/discount/getMany',
        method: 'GET',
        tags: ['Discount'],
        inputStructure: 'detailed',
      })
      .input(discountContract.getMany.input)
      .output(discountContract.getMany.output)
      .handler(({ input }) => discountController.getMany({ input })),
    validateCode: protectedProcedure
      .route({
        summary: 'Validate discount code',
        description: 'Validate and get discount details by code',
        path: '/discount/validateCode',
        method: 'GET',
        tags: ['Discount'],
        inputStructure: 'detailed',
      })
      .input(discountContract.validateCode.input)
      .output(discountContract.validateCode.output)
      .handler(({ input }) => discountController.validateCode({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new discount',
        description: 'Create a new discount',
        path: '/discount/create',
        method: 'POST',
        tags: ['Discount'],
        inputStructure: 'detailed',
      })
      .input(discountContract.create.input)
      .output(discountContract.create.output)
      .handler(({ input }) => discountController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update a discount',
        description: 'Update a discount',
        path: '/discount/update',
        method: 'POST',
        tags: ['Discount'],
        inputStructure: 'detailed',
      })
      .input(discountContract.update.input)
      .output(discountContract.update.output)
      .handler(({ input }) => discountController.update({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a discount by ID',
        description: 'Delete a discount by ID',
        path: '/discount/delete',
        method: 'DELETE',
        tags: ['Discount'],
        inputStructure: 'detailed',
      })
      .input(discountContract.delete.input)
      .output(discountContract.delete.output)
      .handler(({ input }) => discountController.delete({ input })),
  },
})
