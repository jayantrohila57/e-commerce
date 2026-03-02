import type {
  productContract,
  baseProductSchema,
  productInsertSchema,
  productSelectSchema,
  productUpdateSchema,
} from "./product.schema";
import type z from "zod/v3";

// CORE
export type ProductBase = z.infer<typeof baseProductSchema>;
export type ProductSelect = z.infer<typeof productSelectSchema>;
export type ProductInsert = z.infer<typeof productInsertSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

// GET
export type GetProductInput = z.input<typeof productContract.get.input>;
export type GetProductOutput = z.output<typeof productContract.get.output>;

// GET MANY
export type GetManyProductsInput = z.input<typeof productContract.getMany.input>;
export type GetManyProductsOutput = z.output<typeof productContract.getMany.output>;

// GET BY SLUG
export type GetProductBySlugInput = z.input<typeof productContract.getBySlug.input>;
export type GetProductBySlugOutput = z.output<typeof productContract.getBySlug.output>;

// PDP PRODUCT
export type GetPDPProductInput = z.input<typeof productContract.getPDPProduct.input>;
export type GetPDPProductOutput = z.output<typeof productContract.getPDPProduct.output>;

// PRODUCTS BY SERIES
export type GetProductsBySeriesSlugInput = z.input<typeof productContract.getProductsBySeriesSlug.input>;
export type GetProductsBySeriesSlugOutput = z.output<typeof productContract.getProductsBySeriesSlug.output>;

// PRODUCT WITH VARIANTS
export type GetProductWithProductVariantsInput = z.input<typeof productContract.getProductWithProductVariants.input>;
export type GetProductWithProductVariantsOutput = z.output<typeof productContract.getProductWithProductVariants.output>;

// CREATE
export type CreateProductInput = z.input<typeof productContract.create.input>;
export type CreateProductOutput = z.output<typeof productContract.create.output>;

// UPDATE
export type UpdateProductInput = z.input<typeof productContract.update.input>;
export type UpdateProductOutput = z.output<typeof productContract.update.output>;

// DELETE
export type DeleteProductInput = z.input<typeof productContract.delete.input>;
export type DeleteProductOutput = z.output<typeof productContract.delete.output>;

// SEARCH
export type SearchProductInput = z.input<typeof productContract.search.input>;
export type SearchProductOutput = z.output<typeof productContract.search.output>;
