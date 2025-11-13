import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from './auth'
import { debugLog } from '@/shared/utils/lib/logger.utils'

export const getServerSession = cache(async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  })
  return {
    ...data,
  }
})

type Permission = 'create' | 'list' | 'set-role' | 'ban' | 'impersonate' | 'delete' | 'set-password' | 'get' | 'update'

export const getServerUserPermission = async (permission: Permission[]) => {
  const has = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permission: {
        user: permission,
      },
    },
  })
  if (!has.error) {
    debugLog('USER:HAS_PERMISSION:ERROR')
    return false
  }
  return Boolean(has.success)
}

export const getServerAccounts = cache(async () => {
  const data = await auth.api.listUserAccounts({
    headers: await headers(),
  })
  return data
})

export const getServerSessions = cache(async () => {
  const data = await auth.api.listSessions({
    headers: await headers(),
  })
  return data
})

export type ServerSessionType = typeof auth.$Infer.Session
