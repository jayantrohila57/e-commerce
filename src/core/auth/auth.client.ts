import { createAuthClient } from 'better-auth/react'
import { nextCookies } from 'better-auth/next-js'
import { inferAdditionalFields, twoFactorClient, passkeyClient } from 'better-auth/client/plugins'
import { type auth } from './auth'

export const {
  $Infer,
  signIn,
  signUp,
  signOut,
  twoFactor,
  useSession,
  getSession,
  updateUser,
  changeEmail,
  resetPassword,
  revokeSession,
  changePassword,
  revokeOtherSessions,
  sendVerificationEmail,
  requestPasswordReset,
} = createAuthClient({
  plugins: [
    nextCookies(),
    passkeyClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = '/auth/2fa'
      },
    }),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const getClientSession = async () => {
  const session = await getSession()
  return session
}

export type ClientSessionType = typeof $Infer.Session
