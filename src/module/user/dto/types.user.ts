import { type userContract } from './dto.user.contract'
import type z from 'zod/v3'

export type GetUserInput = z.infer<typeof userContract.get.input>
export type GetUserOutput = z.infer<typeof userContract.get.output>

export type GetUsersInput = z.infer<typeof userContract.getMany.input>
export type GetUsersOutput = z.infer<typeof userContract.getMany.output>

export type CreateUserInput = z.infer<typeof userContract.create.input>
export type CreateUserOutput = z.infer<typeof userContract.create.output>

export type UpdateUserInput = z.infer<typeof userContract.update.input>
export type UpdateUserOutput = z.infer<typeof userContract.update.output>

export type DeleteUserInput = z.infer<typeof userContract.delete.input>
export type DeleteUserOutput = z.infer<typeof userContract.delete.output>

export type GetControllerInput = { input: GetUserInput }
export type GetControllerOutput = Promise<GetUserOutput>

export type GetManyControllerInput = { input: GetUsersInput }
export type GetManyControllerOutput = Promise<GetUsersOutput>

export type DeleteControllerInput = { input: DeleteUserInput }
export type DeleteControllerOutput = Promise<DeleteUserOutput>

export type UpdateControllerInput = { input: UpdateUserInput }
export type UpdateControllerOutput = Promise<UpdateUserOutput>

export type CreateControllerInput = { input: CreateUserInput }
export type CreateControllerOutput = Promise<CreateUserOutput>

export type GetServiceInput = { body: GetUserInput['body']; params: GetUserInput['params'] }
export type GetServiceOutput = Promise<GetUserOutput['data'] | null>

export type GetManyServiceInput = { body: GetUsersInput['body']; params: GetUsersInput['params'] }
export type GetManyServiceOutput = Promise<GetUsersOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteUserInput['params'] }
export type DeleteServiceOutput = Promise<DeleteUserOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateUserInput['body']; params: UpdateUserInput['params'] }
export type UpdateServiceOutput = Promise<UpdateUserOutput['data'] | null>

export type CreateServiceInput = { body: CreateUserInput['body'] }
export type CreateServiceOutput = Promise<CreateUserOutput['data'] | null>
