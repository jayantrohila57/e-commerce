import { type verificationContract } from './dto.verification.contract'
import type z from 'zod'

export type GetVerificationInput = z.infer<typeof verificationContract.get.input>
export type GetVerificationOutput = z.infer<typeof verificationContract.get.output>

export type GetVerificationsInput = z.infer<typeof verificationContract.getMany.input>
export type GetVerificationsOutput = z.infer<typeof verificationContract.getMany.output>

export type CreateVerificationInput = z.infer<typeof verificationContract.create.input>
export type CreateVerificationOutput = z.infer<typeof verificationContract.create.output>

export type UpdateVerificationInput = z.infer<typeof verificationContract.update.input>
export type UpdateVerificationOutput = z.infer<typeof verificationContract.update.output>

export type DeleteVerificationInput = z.infer<typeof verificationContract.delete.input>
export type DeleteVerificationOutput = z.infer<typeof verificationContract.delete.output>
