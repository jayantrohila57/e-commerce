import { wishlistController } from './api.wishlist.controller'
import { wishlistContract } from '../dto/dto.wishlist.contract'
import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'

export const wishlistRouter = createTRPCRouter({
  get: protectedProcedure
    .input(wishlistContract.get.input)
    .output(wishlistContract.get.output)
    .query(({ input }) => wishlistController.get({ input })),
  getMany: protectedProcedure
    .input(wishlistContract.getMany.input)
    .output(wishlistContract.getMany.output)
    .query(({ input }) => wishlistController.getMany({ input })),
  create: protectedProcedure
    .input(wishlistContract.create.input)
    .output(wishlistContract.create.output)
    .mutation(({ input }) => wishlistController.create({ input })),
  delete: protectedProcedure
    .input(wishlistContract.delete.input)
    .output(wishlistContract.delete.output)
    .mutation(({ input }) => wishlistController.delete({ input })),
})
