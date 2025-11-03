import { protectedProcedure } from '@/core/orpc/orpc.server'
import { cartController } from './api.cart.controller'
import { cartContract } from '../dto/dto.cart.contract'

export const cartRouter = protectedProcedure.router({
  cart: {
    get: protectedProcedure
      .route({
        summary: 'Get a cart by ID',
        description: 'Get a cart by ID',
        path: '/cart/get',
        method: 'GET',
        tags: ['Cart'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(cartContract.get.input)
      .output(cartContract.get.output)
      .handler(({ input }) => cartController.get({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many carts',
        description: 'Get many carts',
        path: '/cart/getMany',
        method: 'GET',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.getMany.input)
      .output(cartContract.getMany.output)
      .handler(({ input }) => cartController.getMany({ input })),
    getUserCart: protectedProcedure
      .route({
        summary: 'Get cart for a user with items',
        description: 'Get active cart for a specific user including all cart items',
        path: '/cart/getUserCart',
        method: 'GET',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.getUserCart.input)
      .output(cartContract.getUserCart.output)
      .handler(({ input }) => cartController.getUserCart({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new cart',
        description: 'Create a new cart',
        path: '/cart/create',
        method: 'POST',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.create.input)
      .output(cartContract.create.output)
      .handler(({ input }) => cartController.create({ input })),
    addItem: protectedProcedure
      .route({
        summary: 'Add item to cart',
        description: 'Add a product to cart',
        path: '/cart/addItem',
        method: 'POST',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.addItem.input)
      .output(cartContract.addItem.output)
      .handler(({ input }) => cartController.addItem({ input })),
    updateItem: protectedProcedure
      .route({
        summary: 'Update cart item quantity',
        description: 'Update quantity of an item in cart',
        path: '/cart/updateItem',
        method: 'POST',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.updateItem.input)
      .output(cartContract.updateItem.output)
      .handler(({ input }) => cartController.updateItem({ input })),
    removeItem: protectedProcedure
      .route({
        summary: 'Remove item from cart',
        description: 'Remove an item from cart',
        path: '/cart/removeItem',
        method: 'DELETE',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.removeItem.input)
      .output(cartContract.removeItem.output)
      .handler(({ input }) => cartController.removeItem({ input })),
    clearCart: protectedProcedure
      .route({
        summary: 'Clear all items from cart',
        description: 'Remove all items from a cart',
        path: '/cart/clearCart',
        method: 'DELETE',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.clearCart.input)
      .output(cartContract.clearCart.output)
      .handler(({ input }) => cartController.clearCart({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update a cart',
        description: 'Update a cart',
        path: '/cart/update',
        method: 'POST',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.update.input)
      .output(cartContract.update.output)
      .handler(({ input }) => cartController.update({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a cart by ID',
        description: 'Delete a cart by ID',
        path: '/cart/delete',
        method: 'DELETE',
        tags: ['Cart'],
        inputStructure: 'detailed',
      })
      .input(cartContract.delete.input)
      .output(cartContract.delete.output)
      .handler(({ input }) => cartController.delete({ input })),
  },
})
