import z from "zod/v3";
import { detailedResponse } from "@/shared/schema/api.schema";

export const catalogOverviewSchema = z.object({
  totalProducts: z.number().int().nonnegative(),
  totalProductVariants: z.number().int().nonnegative(),
  totalCategories: z.number().int().nonnegative(),
  totalSubcategories: z.number().int().nonnegative(),
  totalAttributes: z.number().int().nonnegative(),
});

export const catalogContract = {
  overview: {
    input: z.object({}).optional(),
    output: detailedResponse(catalogOverviewSchema),
  },
};
