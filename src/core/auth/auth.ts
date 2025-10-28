import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/core/db/db'
import { env } from '@/shared/config/env'
import { site } from '@/shared/config/site'
import { sendEmailVerificationEmail } from '@/shared/components/mail/mail.methods'
import { nextCookies } from 'better-auth/next-js'

const MAX_AGE = 60 * 60 // 1 hour

export const auth = betterAuth({
  appName: site.name,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: MAX_AGE
    }
  },
  rateLimit: {
    storage:'database',
    
  },
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // requireEmailVerification: true
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url })
    }
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }
  },
  plugins: [nextCookies()]
})
