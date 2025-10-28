import { createAuthClient } from 'better-auth/react'
import { nextCookies } from 'better-auth/next-js'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { auth } from './auth'

export const {
  $Infer,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  resetPassword,
  sendVerificationEmail,
  requestPasswordReset
} = createAuthClient({
  plugins: [nextCookies(), inferAdditionalFields<typeof auth>()]
})

export const getClientSession = async () => {
  const session = await getSession()
  return session
}

export type ClientSessionType = typeof $Infer.Session
