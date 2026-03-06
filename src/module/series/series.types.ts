import type z from "zod/v3";
import type {
  seriesBaseSchema,
  seriesContract,
  seriesInsertSchema,
  seriesSelectSchema,
  seriesUpdateSchema,
} from "./series.schema";

export type SeriesBase = z.infer<typeof seriesBaseSchema>;
export type SeriesSelect = z.infer<typeof seriesSelectSchema>;
export type SeriesInsert = z.infer<typeof seriesInsertSchema>;
export type SeriesUpdate = z.infer<typeof seriesUpdateSchema>;

export type GetManySeriesInput = z.infer<typeof seriesContract.getMany.input>;
export type GetManySeriesOutput = z.infer<typeof seriesContract.getMany.output>;

export type CreateSeriesInput = z.infer<typeof seriesContract.create.input>;
export type CreateSeriesOutput = z.infer<typeof seriesContract.create.output>;

export type UpdateSeriesInput = z.infer<typeof seriesContract.update.input>;
export type UpdateSeriesOutput = z.infer<typeof seriesContract.update.output>;

export type DeleteSeriesInput = z.infer<typeof seriesContract.delete.input>;
export type DeleteSeriesOutput = z.infer<typeof seriesContract.delete.output>;
