import type { subcategoryContract } from "./subcategory.schema";
import type z from "zod/v3";

export type GetSubcategoryBySlugInput = z.infer<typeof subcategoryContract.getBySlug.input>;
export type GetSubcategoryBySlugOutput = z.infer<typeof subcategoryContract.getBySlug.output>;

export type GetSubcategoriesInput = z.infer<typeof subcategoryContract.getMany.input>;
export type GetSubcategoriesOutput = z.infer<typeof subcategoryContract.getMany.output>;

export type CreateSubcategoryInput = z.infer<typeof subcategoryContract.create.input>;
export type CreateSubcategoryOutput = z.infer<typeof subcategoryContract.create.output>;

export type UpdateSubcategoryInput = z.infer<typeof subcategoryContract.update.input>;
export type UpdateSubcategoryOutput = z.infer<typeof subcategoryContract.update.output>;

export type DeleteSubcategoryInput = z.infer<typeof subcategoryContract.delete.input>;
export type DeleteSubcategoryOutput = z.infer<typeof subcategoryContract.delete.output>;
