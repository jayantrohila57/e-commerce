import { debugLog } from '@/shared/utils/lib/logger.utils'
import { createORPCClient, onError } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { type RouterClient } from '@orpc/server'
import { env } from '@/shared/config/env'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { type appRouter } from './orpc.router'

const link = new RPCLink({
  url: env.NEXT_PUBLIC_API_URL,
  interceptors: [
    onError((error) => {
      debugLog('ORPC CLIENT', error)
    }),
  ],
})

export const apiServer: RouterClient<typeof appRouter> = createORPCClient(link)
export const apiClient = createTanstackQueryUtils(apiServer)
