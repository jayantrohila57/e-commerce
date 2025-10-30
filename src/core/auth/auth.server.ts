import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from './auth'

export const getServerSession = cache(async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  })
  return {
    ...data,
  }
})

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
