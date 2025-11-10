import { type sessionContract } from './dto.session.contract'
import type z from 'zod/v3'

export type GetSessionInput = z.infer<typeof sessionContract.get.input>
export type GetSessionOutput = z.infer<typeof sessionContract.get.output>

export type GetSessionsInput = z.infer<typeof sessionContract.getMany.input>
export type GetSessionsOutput = z.infer<typeof sessionContract.getMany.output>

export type CreateSessionInput = z.infer<typeof sessionContract.create.input>
export type CreateSessionOutput = z.infer<typeof sessionContract.create.output>

export type UpdateSessionInput = z.infer<typeof sessionContract.update.input>
export type UpdateSessionOutput = z.infer<typeof sessionContract.update.output>

export type DeleteSessionInput = z.infer<typeof sessionContract.delete.input>
export type DeleteSessionOutput = z.infer<typeof sessionContract.delete.output>
