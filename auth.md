# Auth Audit

Date: 2026-04-06

This is a manual audit of the current auth implementation in this repo, focused on what is already wired up, what external services are required, and what still looks risky or incomplete for a production deployment.

## Executive Summary

The app already has a substantial auth system in place. Better Auth is configured for:

- email/password sign-up and sign-in
- email verification
- password reset
- GitHub OAuth
- passkeys
- two-factor auth
- session listing and revocation
- account email change and account deletion verification
- role-based access control for admin/staff/customer/user

That means the core auth stack is not “missing.” The main work left is production hardening:

- confirm all required environment variables are present in the deployed environment
- verify email delivery, OAuth redirect URLs, and passkey origin/rpID settings for the real domain
- fix a few code-level risks around environment parsing and resend/signup hooks
- confirm the auth API route is protected the way you want under load

## What Is Already Set Up

### Auth provider and session layer

- Better Auth server config lives in [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L49).
- Database adapter is Drizzle + Postgres via `drizzleAdapter(db, { provider: "pg" })` in [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L104).
- Session cookie cache is enabled in [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L95).
- Client auth helpers are exposed from [src/core/auth/auth.client.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.client.ts#L9).
- Server session helpers are exposed from [src/core/auth/auth.server.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.server.ts#L7).

### User-facing flows

- Sign in page: [src/app/(auth)/auth/sign-in/page.tsx](/d:/Repositories/template/e-commerce/src/app/%28auth%29/auth/sign-in/page.tsx#L1)
- Sign up page: [src/app/(auth)/auth/sign-up/page.tsx](/d:/Repositories/template/e-commerce/src/app/%28auth%29/auth/sign-up/page.tsx#L1)
- Forgot password page: [src/app/(auth)/auth/forgot-password/page.tsx](/d:/Repositories/template/e-commerce/src/app/%28auth%29/auth/forgot-password/page.tsx#L1)
- Reset password page: [src/app/(auth)/auth/reset-password/page.tsx](/d:/Repositories/template/e-commerce/src/app/%28auth%29/auth/reset-password/page.tsx#L1)
- Verify email page: [src/app/(auth)/auth/verify-email/page.tsx](/d:/Repositories/template/e-commerce/src/app/%28auth%29/auth/verify-email/page.tsx#L1)

### Account management

- Session listing and revocation: [src/module/account/account.session.tsx](/d:/Repositories/template/e-commerce/src/module/account/account.session.tsx#L1)
- Password change flow: [src/module/account/account.password-change.tsx](/d:/Repositories/template/e-commerce/src/module/account/account.password-change.tsx#L1)
- Revoke other sessions: [src/module/account/account.revoke-session-button.tsx](/d:/Repositories/template/e-commerce/src/module/account/account.revoke-session-button.tsx#L1)

### Security and access control

- Admin/staff/customer/user RBAC is wired into Better Auth in [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L157).
- Protected app routes are checked in [proxy.ts](/d:/Repositories/template/e-commerce/proxy.ts#L1).
- Signup/sign-in rate limiting and bot/email filtering use Arcjet in [src/app/api/auth/[...all]/arkjet.config.ts](/d:/Repositories/template/e-commerce/src/app/api/auth/[...all]/arkjet.config.ts#L1).

## Third-Party Services You Need

### Required

1. **Database**
   - Postgres is required because Better Auth is using the Drizzle adapter against [src/core/db/db](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L8).
   - `DATABASE_URL` must be set in production.

2. **Better Auth**
   - This is the auth engine itself.
   - You need `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in production.

3. **Transactional email provider**
   - The app sends verification, reset-password, welcome, and delete-account emails.
   - The mail layer uses Resend through [src/shared/components/mail/mail.methods.tsx](/d:/Repositories/template/e-commerce/src/shared/components/mail/mail.methods.tsx#L1) and [src/core/mail/resend.client](/d:/Repositories/template/e-commerce/src/shared/components/mail/mail.methods.tsx#L2).
   - Required envs include `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

4. **OAuth provider for GitHub**
   - GitHub sign-in is configured in [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L123).
   - You need GitHub OAuth app credentials and redirect URLs matching your deployed domain.

### Optional but already enabled

1. **Passkeys**
   - Passkey auth is configured with `@better-auth/passkey`.
   - No external SaaS is required, but the real domain/origin must match your deployment.

2. **Arcjet**
   - Used for signup/sign-in protection and rate limiting.
   - Helpful for production, especially if the site is public.

3. **2FA**
   - Two-factor auth is enabled through Better Auth’s plugin.

## Audit Findings

### 1. Production environment validation is too loose

`src/shared/config/env.server.ts` converts env values with `String(...)`, `Number(...)`, and `Boolean(...)`. That means missing env vars can silently become `"undefined"`, `NaN`, or `true` in some cases.

Examples:

- `Boolean(process.env.SKIP_ENV_VALIDATION)` will be `true` for any non-empty string, including `"false"`.
- `Boolean(process.env.USE_DEBUG_LOGS)` has the same issue.
- `Number(process.env.VERCEL)` can become `NaN`.

This matters for auth because `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, GitHub OAuth credentials, and Resend creds should fail loudly if they are missing.

Reference: [src/shared/config/env.server.ts](/d:/Repositories/template/e-commerce/src/shared/config/env.server.ts#L8)

### 2. The signup welcome-email hook is likely too broad

In [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L129), the `after` hook sends a welcome email when the path starts with `/sign-up` or `/verify-email`.

That means:

- the welcome email may be tied to both signup and verification events
- it may fire on route patterns rather than a single guaranteed “account created” event
- if the verify-email flow is revisited, there is a risk of duplicate welcome messaging depending on Better Auth’s hook behavior

This is not necessarily broken, but it deserves a production check.

### 3. GitHub OAuth sign-in flow should be verified on the deployed domain

GitHub auth is present, but the deployment must have the right callback URL and environment variables. The code alone does not guarantee the app registration is correct.

Reference: [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L123), [src/module/auth/auth.github-sign-in.tsx](/d:/Repositories/template/e-commerce/src/module/auth/auth.github-sign-in.tsx#L1)

### 4. Passkey config depends on the final deployed origin

Passkeys compute `rpID`, `rpName`, and `origin` from `BETTER_AUTH_URL` or site config in [src/core/auth/auth.ts](/d:/Repositories/template/e-commerce/src/core/auth/auth.ts#L23).

If the deployed domain differs from your local/site config, passkeys can fail silently or be unavailable for users.

### 5. Auth route protection is only applied to POST requests

The Better Auth route is wired in [src/app/api/auth/[...all]/route.ts](/d:/Repositories/template/e-commerce/src/app/api/auth/[...all]/route.ts#L8), but Arcjet protection is only checked in `POST`.

That is probably fine for sign-in/sign-up protection, but it means you should confirm your exact threat model. If you want stricter protection, you may want to review whether GET-based auth endpoints also need attention.

### 6. Some user experience paths still depend on the email service

The whole recovery and verification experience depends on email delivery working correctly:

- sign-up verification
- password reset
- email change verification
- account deletion confirmation

If email sending fails, those flows will look “broken” to users even though auth itself is configured.

## Coverage Checklist

### Present

- email/password signup
- email/password sign-in
- email verification on signup
- resend verification email
- forgot password
- reset password
- GitHub OAuth
- passkey sign-in
- two-factor auth
- current session management
- revoke single session
- revoke other sessions
- change email
- change password
- delete account verification
- RBAC/admin permission wiring

### Needs verification in production

- `BETTER_AUTH_URL` matches the deployed domain exactly
- `BETTER_AUTH_SECRET` is set and stable
- GitHub OAuth callback URLs are correct
- Resend API key and sender domain are verified
- passkey origin/rpID matches the real site
- DB schema/migrations for Better Auth are fully applied
- Arcjet key is valid and production rules are tuned

## Recommended Production Services Map

If you want this deployment to be production-safe, the minimum stack should be:

- **Postgres** for auth data and sessions
- **Better Auth** for auth logic
- **Resend** for email verification/reset flows
- **GitHub OAuth app** for social login
- **Arcjet** for abuse protection
- **Optional passkeys + 2FA** for stronger account security

## What I Would Fix Next

1. Tighten env validation so missing auth env vars fail fast.
2. Confirm the GitHub OAuth app settings against the deployed URL.
3. Verify Resend sender/domain setup and actual email delivery in production.
4. Test sign-up, verify-email, forgot-password, reset-password, and delete-account end to end on the live domain.
5. Review the welcome-email hook so it only fires exactly once per intended event.

## Notes

This audit is based on the current repo state, not on live production logs or external dashboard settings. So the code is mostly ready, but production correctness still depends on your deployed env vars and third-party app settings.
