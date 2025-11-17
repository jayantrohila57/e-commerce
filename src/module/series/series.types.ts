import {
  type seriesContract,
  seriesBaseSchema,
  seriesSelectSchema,
  seriesInsertSchema,
  seriesUpdateSchema,
} from './series.schema'
import type z from 'zod/v3'

export type SeriesBase = z.infer<typeof seriesBaseSchema>
export type SeriesSelect = z.infer<typeof seriesSelectSchema>
export type SeriesInsert = z.infer<typeof seriesInsertSchema>
export type SeriesUpdate = z.infer<typeof seriesUpdateSchema>

export type GetSeriesInput = z.infer<typeof seriesContract.get.input>
export type GetSeriesOutput = z.infer<typeof seriesContract.get.output>

export type GetSeriesBySlugInput = z.infer<typeof seriesContract.getBySlug.input>
export type GetSeriesBySlugOutput = z.infer<typeof seriesContract.getBySlug.output>

export type GetManySeriesInput = z.infer<typeof seriesContract.getMany.input>
export type GetManySeriesOutput = z.infer<typeof seriesContract.getMany.output>

export type CreateSeriesInput = z.infer<typeof seriesContract.create.input>
export type CreateSeriesOutput = z.infer<typeof seriesContract.create.output>

export type UpdateSeriesInput = z.infer<typeof seriesContract.update.input>
export type UpdateSeriesOutput = z.infer<typeof seriesContract.update.output>

export type DeleteSeriesInput = z.infer<typeof seriesContract.delete.input>
export type DeleteSeriesOutput = z.infer<typeof seriesContract.delete.output>
