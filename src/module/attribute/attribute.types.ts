import type { attributeContract } from "./attribute.schema";
import type z from "zod/v3";

export type GetAttributeInput = z.infer<typeof attributeContract.get.input>;
export type GetAttributeOutput = z.infer<typeof attributeContract.get.output>;

export type GetAttributeBySlugInput = z.infer<typeof attributeContract.getBySlug.input>;
export type GetAttributeBySlugOutput = z.infer<typeof attributeContract.getBySlug.output>;

export type GetAttributesBySeriesInput = z.infer<typeof attributeContract.getBySeries.input>;
export type GetAttributesBySeriesOutput = z.infer<typeof attributeContract.getBySeries.output>;

export type GetManyAttributesInput = z.infer<typeof attributeContract.getMany.input>;
export type GetManyAttributesOutput = z.infer<typeof attributeContract.getMany.output>;

export type CreateAttributeInput = z.infer<typeof attributeContract.create.input>;
export type CreateAttributeOutput = z.infer<typeof attributeContract.create.output>;

export type UpdateAttributeInput = z.infer<typeof attributeContract.update.input>;
export type UpdateAttributeOutput = z.infer<typeof attributeContract.update.output>;

export type DeleteAttributeInput = z.infer<typeof attributeContract.delete.input>;
export type DeleteAttributeOutput = z.infer<typeof attributeContract.delete.output>;

export type SearchAttributeInput = z.infer<typeof attributeContract.search.input>;
export type SearchAttributeOutput = z.infer<typeof attributeContract.search.output>;
