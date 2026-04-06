import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { twoFactor } from "better-auth/plugins/two-factor";
import { db } from "@/core/db/db";
import {
  sendDeleteAccountEmail,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "@/shared/components/mail/mail.methods";
import { serverEnv } from "@/shared/config/env.server";
import { site, siteConfig } from "@/shared/config/site";
import { debugLog } from "@/shared/utils/lib/logger.utils";
import { resolveNewUserRole } from "./auth.roles";
import { ac, admin, customer, staff, user } from "./permissions";

const MAX_AGE = 60 * 60; // 1 hour

function getTrustedOrigins(): string[] {
  const origins: string[] = [];

  // Add BETTER_AUTH_URL if set
  if (serverEnv.BETTER_AUTH_URL) {
    try {
      const url = new URL(serverEnv.BETTER_AUTH_URL);
      origins.push(url.origin);
    } catch {
      // Invalid URL, skip
    }
  }

  // Add site URL if set
  if (site.url) {
    try {
      const url = new URL(site.url);
      origins.push(url.origin);
    } catch {
      // Invalid URL, skip
    }
  }

  // Add production website
  origins.push(siteConfig.urls.website);

  // Add common development origins
  origins.push("http://localhost:3000");
  origins.push("http://127.0.0.1:3000");
  origins.push("http://localhost:3001");
  origins.push("http://127.0.0.1:3001");

  // Add Vercel preview URLs pattern
  if (serverEnv.VERCEL_URL) {
    origins.push(`https://${serverEnv.VERCEL_URL}`);
  }

  // Remove duplicates
  return [...new Set(origins)].filter(Boolean);
}

function getPasskeyConfig() {
  const authUrl = serverEnv.BETTER_AUTH_URL || site.url || siteConfig.urls.website;

  try {
    const url = new URL(authUrl);
    return {
      rpID: url.hostname,
      rpName: site.name,
      origin: url.origin,
    };
  } catch {
    return {
      rpID: "localhost",
      rpName: site.name,
      origin: "http://localhost:3000",
    };
  }
}

function normalizeEmailUser(user: { email: string; name?: string | null }) {
  return {
    email: user.email,
    name: user.name?.trim() || "there",
  };
}

export const auth = betterAuth({
  logger: {
    disabled: false,
    disableColors: false,
    level: "info",
    log: (level, message, ...args) => {
      debugLog(`[${level}] ${message}`, { ...args });
    },
  },
  appName: site.name,
  trustedOrigins: getTrustedOrigins(),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        returned: true,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        user,
        url,
        newEmail,
      }: {
        user: { email: string; name?: string | null };
        url: string;
        newEmail: string;
      }) => {
        await sendEmailVerificationEmail({
          user: {
            ...normalizeEmailUser(user),
            email: newEmail,
          },
          url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountEmail({ user: normalizeEmailUser(user), url });
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: MAX_AGE,
    },
  },
  rateLimit: {
    storage: "database",
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user: normalizeEmailUser(user), url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: false,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const verificationUrl = new URL(url);
      verificationUrl.searchParams.set("callbackURL", "/auth/sign-in?verified=1");
      await sendEmailVerificationEmail({ user: normalizeEmailUser(user), url: verificationUrl.toString() });
    },
  },
  socialProviders: {
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up") || ctx.path.startsWith("/verify-email")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx?.body?.name,
          email: ctx?.body?.email,
        };

        if (user != null) {
          await sendWelcomeEmail({ user: normalizeEmailUser(user), url: ctx.path });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          return {
            data: {
              ...newUser,
              role: resolveNewUserRole(typeof newUser.role === "string" ? newUser.role : undefined),
            },
          };
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    twoFactor(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
        customer,
        staff,
      },
    }),
    passkey(getPasskeyConfig()),
  ],
});
