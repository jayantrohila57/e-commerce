import { type InferContractRouterInputs, type InferContractRouterOutputs } from '@orpc/contract'
import { type userContract } from './dto.user.contract'

export type Inputs = InferContractRouterInputs<typeof userContract>
export type Outputs = InferContractRouterOutputs<typeof userContract>

export type GetUserInput = Inputs['get']
export type GetUserOutput = Outputs['get']

export type GetUsersInput = Inputs['getMany']
export type GetUsersOutput = Outputs['getMany']

export type CreateUserInput = Inputs['create']
export type CreateUserOutput = Outputs['create']

export type UpdateUserInput = Inputs['update']
export type UpdateUserOutput = Outputs['update']

export type DeleteUserInput = Inputs['delete']
export type DeleteUserOutput = Outputs['delete']

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
