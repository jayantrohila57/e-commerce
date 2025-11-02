import { ORPCError } from '@orpc/server'
import { implement } from '@orpc/server'

import { getServerSession } from '../auth/auth.server'
import { debugLog } from '@/shared/utils/lib/logger.utils'
import { contract } from './orpc.contract'

export async function createORPCContext(opts: { headers: Headers }) {
  const { session, user } = await getServerSession()

  return {
    headers: opts.headers,
    session,
    user,
  }
}

const os = implement(contract)
const o = os.$context<Awaited<ReturnType<typeof createORPCContext>>>()

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now()

  try {
    return await next()
  } finally {
    debugLog(`[oRPC] ${path[0]} took ${Date.now() - start}ms to execute`)
  }
})

export const publicProcedure = o.use(timingMiddleware)

export const protectedProcedure = publicProcedure.use(({ context, next }) => {
  if (!context.session) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return next({ context })
})
