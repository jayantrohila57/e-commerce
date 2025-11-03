import { type accountContract } from './dto.account.contract'
import type z from 'zod'

export type GetAccountInput = z.infer<typeof accountContract.get.input>
export type GetAccountOutput = z.infer<typeof accountContract.get.output>

export type GetAccountsInput = z.infer<typeof accountContract.getMany.input>
export type GetAccountsOutput = z.infer<typeof accountContract.getMany.output>

export type CreateAccountInput = z.infer<typeof accountContract.create.input>
export type CreateAccountOutput = z.infer<typeof accountContract.create.output>

export type UpdateAccountInput = z.infer<typeof accountContract.update.input>
export type UpdateAccountOutput = z.infer<typeof accountContract.update.output>

export type DeleteAccountInput = z.infer<typeof accountContract.delete.input>
export type DeleteAccountOutput = z.infer<typeof accountContract.delete.output>
