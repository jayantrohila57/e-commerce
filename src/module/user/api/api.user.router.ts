import { userController } from './api.user.controller'
import { userContract } from '../dto/dto.user.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(userContract.get.input)
    .output(userContract.get.output)
    .query(({ input }) => userController.get({ input })),
  getMany: protectedProcedure
    .input(userContract.getMany.input)
    .output(userContract.getMany.output)
    .query(({ input }) => userController.getMany({ input })),
  create: protectedProcedure
    .input(userContract.create.input)
    .output(userContract.create.output)
    .mutation(({ input }) => userController.create({ input })),
  update: protectedProcedure
    .input(userContract.update.input)
    .output(userContract.update.output)
    .mutation(({ input }) => userController.update({ input })),
  delete: protectedProcedure
    .input(userContract.delete.input)
    .output(userContract.delete.output)
    .mutation(({ input }) => userController.delete({ input })),
})
