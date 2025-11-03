import { type addressContract } from './dto.address.contract'
import type z from 'zod'

export type GetAddressInput = z.infer<typeof addressContract.get.input>
export type GetAddressOutput = z.infer<typeof addressContract.get.output>

export type GetAddressesInput = z.infer<typeof addressContract.getMany.input>
export type GetAddressesOutput = z.infer<typeof addressContract.getMany.output>

export type GetUserAddressesInput = z.infer<typeof addressContract.getUserAddresses.input>
export type GetUserAddressesOutput = z.infer<typeof addressContract.getUserAddresses.output>

export type CreateAddressInput = z.infer<typeof addressContract.create.input>
export type CreateAddressOutput = z.infer<typeof addressContract.create.output>

export type UpdateAddressInput = z.infer<typeof addressContract.update.input>
export type UpdateAddressOutput = z.infer<typeof addressContract.update.output>

export type DeleteAddressInput = z.infer<typeof addressContract.delete.input>
export type DeleteAddressOutput = z.infer<typeof addressContract.delete.output>

export type GetControllerInput = { input: GetAddressInput }
export type GetControllerOutput = Promise<GetAddressOutput>

export type GetManyControllerInput = { input: GetAddressesInput }
export type GetManyControllerOutput = Promise<GetAddressesOutput>

export type GetUserAddressesControllerInput = { input: GetUserAddressesInput }
export type GetUserAddressesControllerOutput = Promise<GetUserAddressesOutput>

export type DeleteControllerInput = { input: DeleteAddressInput }
export type DeleteControllerOutput = Promise<DeleteAddressOutput>

export type UpdateControllerInput = { input: UpdateAddressInput }
export type UpdateControllerOutput = Promise<UpdateAddressOutput>

export type CreateControllerInput = { input: CreateAddressInput }
export type CreateControllerOutput = Promise<CreateAddressOutput>

export type GetServiceInput = { body: GetAddressInput['body']; params: GetAddressInput['params'] }
export type GetServiceOutput = Promise<GetAddressOutput['data'] | null>

export type GetManyServiceInput = { body: GetAddressesInput['body']; params: GetAddressesInput['params'] }
export type GetManyServiceOutput = Promise<GetAddressesOutput['data'] | null>

export type GetUserAddressesServiceInput = { params: GetUserAddressesInput['params'] }
export type GetUserAddressesServiceOutput = Promise<GetUserAddressesOutput['data'] | null>

export type DeleteServiceInput = { params: DeleteAddressInput['params'] }
export type DeleteServiceOutput = Promise<DeleteAddressOutput['data'] | null>

export type UpdateServiceInput = { body: UpdateAddressInput['body']; params: UpdateAddressInput['params'] }
export type UpdateServiceOutput = Promise<UpdateAddressOutput['data'] | null>

export type CreateServiceInput = { body: CreateAddressInput['body'] }
export type CreateServiceOutput = Promise<CreateAddressOutput['data'] | null>
