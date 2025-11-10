import { type seriesContract } from './dto.series.contract'
import type z from 'zod/v3'

export type GetSeriesInput = z.infer<typeof seriesContract.get.input>
export type GetSeriesOutput = z.infer<typeof seriesContract.get.output>

export type GetManySeriesInput = z.infer<typeof seriesContract.getMany.input>
export type GetManySeriesOutput = z.infer<typeof seriesContract.getMany.output>

export type CreateSeriesInput = z.infer<typeof seriesContract.create.input>
export type CreateSeriesOutput = z.infer<typeof seriesContract.create.output>

export type UpdateSeriesInput = z.infer<typeof seriesContract.update.input>
export type UpdateSeriesOutput = z.infer<typeof seriesContract.update.output>

export type DeleteSeriesInput = z.infer<typeof seriesContract.delete.input>
export type DeleteSeriesOutput = z.infer<typeof seriesContract.delete.output>

export type GetControllerInput = { input: GetSeriesInput }
export type GetControllerOutput = Promise<GetSeriesOutput>

export type GetManyControllerInput = { input: GetManySeriesInput }
export type GetManyControllerOutput = Promise<GetManySeriesOutput>

export type CreateControllerInput = { input: CreateSeriesInput }
export type CreateControllerOutput = Promise<CreateSeriesOutput>

export type UpdateControllerInput = { input: UpdateSeriesInput }
export type UpdateControllerOutput = Promise<UpdateSeriesOutput>

export type DeleteControllerInput = { input: DeleteSeriesInput }
export type DeleteControllerOutput = Promise<DeleteSeriesOutput>

export type GetServiceInput = { body: GetSeriesInput['body']; params: GetSeriesInput['params'] }
export type GetServiceOutput = Promise<GetSeriesOutput['data'] | null>

export type GetManyServiceInput = { body: GetManySeriesInput['body']; params: GetManySeriesInput['params'] }
export type GetManyServiceOutput = Promise<GetManySeriesOutput['data'] | null>

export type CreateServiceInput = { body: CreateSeriesInput['body'] }
export type CreateServiceOutput = Promise<CreateSeriesOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateSeriesInput['body']; params: UpdateSeriesInput['params'] }
export type UpdateServiceOutput = Promise<UpdateSeriesOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteSeriesInput['params'] }
export type DeleteServiceOutput = Promise<DeleteSeriesOutput['data'] | null>
