import { type paymentContract } from './dto.payment.contract'
import type z from 'zod/v3'

export type GetPaymentInput = z.infer<typeof paymentContract.get.input>
export type GetPaymentOutput = z.infer<typeof paymentContract.get.output>

export type GetPaymentsInput = z.infer<typeof paymentContract.getMany.input>
export type GetPaymentsOutput = z.infer<typeof paymentContract.getMany.output>

export type CreatePaymentInput = z.infer<typeof paymentContract.create.input>
export type CreatePaymentOutput = z.infer<typeof paymentContract.create.output>

export type UpdatePaymentInput = z.infer<typeof paymentContract.update.input>
export type UpdatePaymentOutput = z.infer<typeof paymentContract.update.output>

export type DeletePaymentInput = z.infer<typeof paymentContract.delete.input>
export type DeletePaymentOutput = z.infer<typeof paymentContract.delete.output>
