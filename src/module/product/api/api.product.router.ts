import { protectedProcedure } from '@/core/orpc/orpc.server'
import { productController } from './api.product.controller'
import { productContract } from '../dto/dto.product.contract'

export const productRouter = protectedProcedure.router({
  product: {
    get: protectedProcedure
      .route({
        summary: 'Get a product by ID or slug',
        description: 'Get a product by ID or slug',
        path: '/product/get',
        method: 'GET',
        tags: ['Product'],
        inputStructure: 'detailed',
        outputStructure: 'compact',
      })
      .input(productContract.get.input)
      .output(productContract.get.output)
      .handler(({ input }) => productController.get({ input })),
    getWithDetails: protectedProcedure
      .route({
        summary: 'Get product with variants and images',
        description: 'Get a product by ID or slug with all variants and images',
        path: '/product/getWithDetails',
        method: 'GET',
        tags: ['Product'],
        inputStructure: 'detailed',
      })
      .input(productContract.getWithDetails.input)
      .output(productContract.getWithDetails.output)
      .handler(({ input }) => productController.getWithDetails({ input })),
    getMany: protectedProcedure
      .route({
        summary: 'Get many products',
        description: 'Get many products',
        path: '/product/getMany',
        method: 'GET',
        tags: ['Product'],
        inputStructure: 'detailed',
      })
      .input(productContract.getMany.input)
      .output(productContract.getMany.output)
      .handler(({ input }) => productController.getMany({ input })),
    searchProducts: protectedProcedure
      .route({
        summary: 'Search products',
        description: 'Search products by name, description, or brand',
        path: '/product/searchProducts',
        method: 'GET',
        tags: ['Product'],
        inputStructure: 'detailed',
      })
      .input(productContract.searchProducts.input)
      .output(productContract.searchProducts.output)
      .handler(({ input }) => productController.searchProducts({ input })),
    getProductsByCategory: protectedProcedure
      .route({
        summary: 'Get products by category',
        description: 'Get all products in a specific category',
        path: '/product/getProductsByCategory',
        method: 'GET',
        tags: ['Product'],
        inputStructure: 'detailed',
      })
      .input(productContract.getProductsByCategory.input)
      .output(productContract.getProductsByCategory.output)
      .handler(({ input }) => productController.getProductsByCategory({ input })),
    create: protectedProcedure
      .route({
        summary: 'Create a new product',
        description: 'Create a new product',
        path: '/product/create',
        method: 'POST',
        tags: ['Product'],
        inputStructure: 'detailed',
      })
      .input(productContract.create.input)
      .output(productContract.create.output)
      .handler(({ input }) => productController.create({ input })),
    update: protectedProcedure
      .route({
        summary: 'Update a product',
        description: 'Update a product',
        path: '/product/update',
        method: 'POST',
        tags: ['Product'],
        inputStructure: 'detailed',
      })
      .input(productContract.update.input)
      .output(productContract.update.output)
      .handler(({ input }) => productController.update({ input })),
    delete: protectedProcedure
      .route({
        summary: 'Delete a product by ID',
        description: 'Delete a product by ID',
        path: '/product/delete',
        method: 'DELETE',
        tags: ['Product'],
        inputStructure: 'detailed',
      })
      .input(productContract.delete.input)
      .output(productContract.delete.output)
      .handler(({ input }) => productController.delete({ input })),
  },
})
