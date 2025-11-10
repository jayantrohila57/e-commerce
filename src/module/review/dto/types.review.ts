import { type reviewContract } from './dto.review.contract'
import type z from 'zod/v3'

export type GetReviewInput = z.infer<typeof reviewContract.get.input>
export type GetReviewOutput = z.infer<typeof reviewContract.get.output>

export type GetReviewsInput = z.infer<typeof reviewContract.getMany.input>
export type GetReviewsOutput = z.infer<typeof reviewContract.getMany.output>

export type GetProductReviewsInput = z.infer<typeof reviewContract.getProductReviews.input>
export type GetProductReviewsOutput = z.infer<typeof reviewContract.getProductReviews.output>

export type GetUserReviewsInput = z.infer<typeof reviewContract.getUserReviews.input>
export type GetUserReviewsOutput = z.infer<typeof reviewContract.getUserReviews.output>

export type CreateReviewInput = z.infer<typeof reviewContract.create.input>
export type CreateReviewOutput = z.infer<typeof reviewContract.create.output>

export type UpdateReviewInput = z.infer<typeof reviewContract.update.input>
export type UpdateReviewOutput = z.infer<typeof reviewContract.update.output>

export type DeleteReviewInput = z.infer<typeof reviewContract.delete.input>
export type DeleteReviewOutput = z.infer<typeof reviewContract.delete.output>

export type GetControllerInput = { input: GetReviewInput }
export type GetControllerOutput = Promise<GetReviewOutput>

export type GetManyControllerInput = { input: GetReviewsInput }
export type GetManyControllerOutput = Promise<GetReviewsOutput>

export type GetProductReviewsControllerInput = { input: GetProductReviewsInput }
export type GetProductReviewsControllerOutput = Promise<GetProductReviewsOutput>

export type GetUserReviewsControllerInput = { input: GetUserReviewsInput }
export type GetUserReviewsControllerOutput = Promise<GetUserReviewsOutput>

export type CreateControllerInput = { input: CreateReviewInput }
export type CreateControllerOutput = Promise<CreateReviewOutput>

export type UpdateControllerInput = { input: UpdateReviewInput }
export type UpdateControllerOutput = Promise<UpdateReviewOutput>

export type DeleteControllerInput = { input: DeleteReviewInput }
export type DeleteControllerOutput = Promise<DeleteReviewOutput>

export type GetServiceInput = { body: GetReviewInput['body']; params: GetReviewInput['params'] }
export type GetServiceOutput = Promise<GetReviewOutput['data'] | null>

export type GetManyServiceInput = { body: GetReviewsInput['body']; params: GetReviewsInput['params'] }
export type GetManyServiceOutput = Promise<GetReviewsOutput['data'] | null>

export type GetProductReviewsServiceInput = {
  body: GetProductReviewsInput['body']
  params: GetProductReviewsInput['params']
}
export type GetProductReviewsServiceOutput = Promise<GetProductReviewsOutput['data'] | null>

export type GetUserReviewsServiceInput = { body: GetUserReviewsInput['body']; params: GetUserReviewsInput['params'] }
export type GetUserReviewsServiceOutput = Promise<GetUserReviewsOutput['data'] | null>

export type CreateServiceInput = { body: CreateReviewInput['body'] }
export type CreateServiceOutput = Promise<CreateReviewOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateReviewInput['body']; params: UpdateReviewInput['params'] }
export type UpdateServiceOutput = Promise<UpdateReviewOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteReviewInput['params'] }
export type DeleteServiceOutput = Promise<DeleteReviewOutput['data'] | null>
