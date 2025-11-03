import { protectedProcedure } from '@/core/orpc/orpc.server'
import { wishlistController } from './api.wishlist.controller'
import { wishlistContract } from '../dto/dto.wishlist.contract'

export const wishlistRouter = protectedProcedure.router({
  wishlist: {
    get: protectedProcedure
      .route({
        summary: 'Get a wishlist by ID',
        description: 'Get a wishlist by ID',
        path: '/wishlist/get',
        method: 'GET',
        tags: ['Wishlist'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(wishlistContract.get.input)
      .output(wishlistContract.get.output)
      .handler(({ input }) => wishlistController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many wishlists',
        description: 'Get many wishlists',
        path: '/wishlist/getMany',
        method: 'GET',
        tags: ['Wishlist'],
        inputStructure: 'detailed',
      })
      .input(wishlistContract.getMany.input)
      .output(wishlistContract.getMany.output)
      .handler(({ input }) => wishlistController.getMany({ input })),
    getUserWishlist: protectedProcedure
      .route({
        summary: 'Get wishlist for a user with items',
        description: 'Get wishlist for a specific user including all wishlist items',
        path: '/wishlist/getUserWishlist',
        method: 'GET',
        tags: ['Wishlist'],
        inputStructure: 'detailed',
      })
      .input(wishlistContract.getUserWishlist.input)
      .output(wishlistContract.getUserWishlist.output)
      .handler(({ input }) => wishlistController.getUserWishlist({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new wishlist',
        description: 'Create a new wishlist',
        path: '/wishlist/create',
        method: 'POST',
        tags: ['Wishlist'],
        inputStructure: 'detailed',
      })
      .input(wishlistContract.create.input)
      .output(wishlistContract.create.output)
      .handler(({ input }) => wishlistController.create({ input })),
    addItem: protectedProcedure
      .route({
        summary: 'Add item to wishlist',
        description: 'Add a product to wishlist',
        path: '/wishlist/addItem',
        method: 'POST',
        tags: ['Wishlist'],
        inputStructure: 'detailed',
      })
      .input(wishlistContract.addItem.input)
      .output(wishlistContract.addItem.output)
      .handler(({ input }) => wishlistController.addItem({ input })),
    removeItem: protectedProcedure
      .route({
        summary: 'Remove item from wishlist',
        description: 'Remove an item from wishlist',
        path: '/wishlist/removeItem',
        method: 'DELETE',
        tags: ['Wishlist'],
        inputStructure: 'detailed',
      })
      .input(wishlistContract.removeItem.input)
      .output(wishlistContract.removeItem.output)
      .handler(({ input }) => wishlistController.removeItem({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a wishlist by ID',
        description: 'Delete a wishlist by ID',
        path: '/wishlist/delete',
        method: 'DELETE',
        tags: ['Wishlist'],
        inputStructure: 'detailed',
      })
      .input(wishlistContract.delete.input)
      .output(wishlistContract.delete.output)
      .handler(({ input }) => wishlistController.delete({ input })),
  },
})
