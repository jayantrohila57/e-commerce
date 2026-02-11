import type z from 'zod/v3'
import type shippingAddressContract from './address.schema'
import { type shippingAddressSelectSchema } from './address.schema'

export type ShippingAddress = z.infer<typeof shippingAddressSelectSchema>

export type GetUserAddressesInput = z.input<typeof shippingAddressContract.getUserAddresses.input>
export type GetUserAddressesOutput = z.output<typeof shippingAddressContract.getUserAddresses.output>

export type CreateShippingAddressInput = z.input<typeof shippingAddressContract.create.input>
export type CreateShippingAddressOutput = z.output<typeof shippingAddressContract.create.output>

export type GetShippingAddressInput = z.input<typeof shippingAddressContract.get.input>
export type GetShippingAddressOutput = z.output<typeof shippingAddressContract.get.output>

export type UpdateShippingAddressInput = z.input<typeof shippingAddressContract.update.input>
export type UpdateShippingAddressOutput = z.output<typeof shippingAddressContract.update.output>

export type DeleteShippingAddressInput = z.input<typeof shippingAddressContract.delete.input>
export type DeleteShippingAddressOutput = z.output<typeof shippingAddressContract.delete.output>

export type SetDefaultAddressInput = z.input<typeof shippingAddressContract.setDefault.input>
export type SetDefaultAddressOutput = z.output<typeof shippingAddressContract.setDefault.output>
