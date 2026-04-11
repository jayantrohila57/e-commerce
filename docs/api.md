# API surface

## Overview

- **Primary API**: tRPC v11 on **`/api/v1`** (GET/POST) with SuperJSON. The React client uses `httpBatchStreamLink` with **`credentials: "include"`** so cookies (auth + guest cart) are sent on same-origin requests.
- **Context** (`createTRPCContext` in `src/core/api/api.methods.ts`):
  - `session` / `user` from Better Auth (`getServerSession`).
  - `guestCartSessionId` parsed from the **`cart_session_id`** cookie (`src/shared/utils/lib/sessionId.ts`). Guest cart procedures must rely on this server-side value, not client-supplied user ids.
- **Standalone routes** (`src/app/api/**`):
  - Better Auth: `/api/auth/[...all]` (Arcjet on POST for sign-in/sign-up paths).
  - Health: `/api/health`, `/api/health/ready` (DB probe; short `Cache-Control` on ready).
  - Blob upload: `/api/blob/upload` (staff/admin; content validated by magic bytes).
  - Razorpay: `/api/payments/razorpay/callback` (browser return), `/api/webhooks/razorpay` (server webhooks).

## Procedures

| Export               | Use case |
|----------------------|----------|
| `publicProcedure`    | Unauthenticated reads/mutations that enforce their own rules (e.g. cookie-bound guest cart). |
| `protectedProcedure` | Any authenticated user. |
| `customerProcedure`  | Roles allowed by customer guard (includes staff/admin for shared storefront APIs). |
| `staffProcedure`     | Staff + admin. |
| `adminProcedure`     | Admin only. |

Role denial returns **`TRPCError` with code `FORBIDDEN`** (not Next.js `forbidden()`), so HTTP clients get a consistent JSON error shape.

## Payments (Razorpay)

- **Callback** and **tRPC confirm** use `completeRazorpayPaymentAfterVerification` (`src/core/payment/razorpay.complete.ts`): HMAC verification (timing-safe), server-side payment fetch, then a **transaction** that updates payment only if `status = 'pending'` to avoid double completion and duplicate confirmation emails when the webhook races the redirect.
- **Webhook** (`src/app/api/webhooks/razorpay/route.ts`): Same conditional payment update inside a transaction; Razorpay retries are idempotent.

## Rate limiting

- **tRPC**: `guardTrpcRateLimit` in `src/core/api/arcjet.trpc.ts` runs for **GET and POST** when `ARKJET_API_KEY` is set and `NODE_ENV !== 'development'`.
- **Auth POST**: Arcjet in `src/app/api/auth/[...all]/arkjet.config.ts` for sign-in/sign-up.

## Environment

Production validation lives in `src/shared/config/env.server.ts`. On **Vercel** (`VERCEL` truthy), **`BLOB_READ_WRITE_TOKEN`** is required so `/api/blob/upload` can run.

## Logging

- Successful tRPC-style `API_RESPONSE` success paths **do not** log full payloads in production (`src/shared/config/api.utils.ts`) to avoid leaking PII into logs.
