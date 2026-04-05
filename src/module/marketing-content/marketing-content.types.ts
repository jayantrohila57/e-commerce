import type z from "zod/v3";
import type {
  marketingContentBaseSchema,
  marketingContentContract,
  marketingContentInsertSchema,
  marketingContentSelectSchema,
  marketingContentUpdateSchema,
} from "./marketing-content.schema";

export type MarketingContentBase = z.infer<typeof marketingContentBaseSchema>;
export type MarketingContentSelect = z.infer<typeof marketingContentSelectSchema>;
export type MarketingContentInsert = z.infer<typeof marketingContentInsertSchema>;
export type MarketingContentUpdate = z.infer<typeof marketingContentUpdateSchema>;

export type GetMarketingContentInput = z.input<typeof marketingContentContract.get.input>;
export type GetMarketingContentOutput = z.output<typeof marketingContentContract.get.output>;

export type GetManyMarketingContentInput = z.input<typeof marketingContentContract.getMany.input>;
export type GetManyMarketingContentOutput = z.output<typeof marketingContentContract.getMany.output>;

export type CreateMarketingContentInput = z.input<typeof marketingContentContract.create.input>;
export type CreateMarketingContentOutput = z.output<typeof marketingContentContract.create.output>;

export type UpdateMarketingContentInput = z.input<typeof marketingContentContract.update.input>;
export type UpdateMarketingContentOutput = z.output<typeof marketingContentContract.update.output>;

export type DeleteMarketingContentInput = z.input<typeof marketingContentContract.delete.input>;
export type DeleteMarketingContentOutput = z.output<typeof marketingContentContract.delete.output>;
