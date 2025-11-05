import { addressController } from './api.address.controller'
import { addressContract } from '../dto/dto.address.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const addressRouter = createTRPCRouter({
  get: protectedProcedure
    .input(addressContract.get.input)
    .output(addressContract.get.output)
    .query(({ input }) => addressController.get({ input })),
  getMany: protectedProcedure
    .input(addressContract.getMany.input)
    .output(addressContract.getMany.output)
    .query(({ input }) => addressController.getMany({ input })),
  create: protectedProcedure
    .input(addressContract.create.input)
    .output(addressContract.create.output)
    .mutation(({ input }) => addressController.create({ input })),
  update: protectedProcedure
    .input(addressContract.update.input)
    .output(addressContract.update.output)
    .mutation(({ input }) => addressController.update({ input })),
  delete: protectedProcedure
    .input(addressContract.delete.input)
    .output(addressContract.delete.output)
    .mutation(({ input }) => addressController.delete({ input })),
})
