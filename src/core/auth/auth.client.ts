import { createAuthClient } from 'better-auth/react'
import { nextCookies } from 'better-auth/next-js'
import { env } from '@/shared/config/env'

export const { signIn, signUp, signOut, useSession, getSession, $Infer } = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true
  },
  plugins: [nextCookies()]
})

export const getClientSession = async () => {
  const session = await getSession()
  return session
}

export type ClientSessionType = typeof $Infer.Session
