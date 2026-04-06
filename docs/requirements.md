# Production requirements audit

This document describes what remains incomplete or risky for treating this project as a launch-ready, no-compromise production web application. It is scoped to: a public e-commerce launch, quality over speed, single-country operation, small catalog and moderate traffic, full payment reliability (including webhooks and refunds), hardened security with high assurance for accounts, privacy and compliance expectations (legal pages, cookie consent, regional awareness), core admin/backoffice, critical order and inventory correctness, strong observability, standard third-party integrations (payments, email, analytics), critical-path automated testing, reasonable performance, and basic accessibility. Reliability is the top non-functional priority when tradeoffs arise.

---

## Launch blockers

- **Checkout totals must match what the customer pays.** The order summary UI hard-codes free shipping, a flat 18% estimated tax, and zero discount while computing a “total” on the client (`checkout-summary.tsx`). Server-side order creation persists `grandTotal` as subtotal plus configured shipping minus discount, without the same tax line in that total. Razorpay intents use `order.grandTotal`. Customers can see one number, authorize another, and support cannot explain invoices—this erodes trust, invites chargebacks, and creates tax and accounting liability.

- **Tax must be a first-class, server-authoritative line item.** The database schema includes `tax_class`, `tax_zone`, and `tax_rule`, but order creation does not align tax with displayed or charged amounts. For a production launch you need jurisdiction rules, consistent `tax_total` on orders, and reconciliation with payment capture—especially given your compliance expectations.

- **Payment confirmation must not trust client-supplied status for privilege escalation.** After Razorpay signature verification, the server still applies the `status` value from the client input when updating the payment row. A malicious or buggy client could attempt inconsistent transitions. Production systems should derive final status from verified provider payloads or strict allowlists after verification.

- **Authorization gaps on order read must be closed.** `order.get` enforces ownership only when the caller’s role is `customer`. Accounts that use other roles (for example a default `user` before role promotion) may be able to read arbitrary orders by ID—a classic insecure direct object reference. Every sensitive read must enforce least privilege: customers see only their orders; staff/admin see all only through explicit, audited procedures.

- **Inventory deduction must not silently skip missing stock rows.** When placing an order, if no `inventory_item` exists for a variant, the loop continues without failing the transaction. That allows overselling whenever catalog or warehouse data is incomplete. Production launch requires either hard failure at order time or a documented “digital / non-stock” path with explicit schema flags.

- **Environment configuration must fail fast and match documentation.** `serverEnv` coerces missing variables with `String()` / `Boolean()` / `Number()`, so critical secrets can become the literal string `"undefined"` and boolean flags can mis-parse. `.env.example` documents `ARCJET_API_KEY` while code reads `ARKJET_API_KEY`, inviting misconfiguration of abuse protection in production.

---

## Missing production requirements (commerce correctness)

- **Single source of truth for pricing at checkout.** Discount codes appear in the UI but the summary uses a zero discount; server-side discount logic must drive both preview APIs and final order totals so merchandising rules cannot be bypassed.

- **Shipping display must match rate rules used in `order.create`.** The UI can load shipping options with real prices, but the summary card still shows “free” shipping. Align summary with `shippingConfig.getOptions` and the persisted `shipping_total`.

- **Multiple payment providers are modeled but not implemented end-to-end.** Schema and enums may include Stripe, PayPal, or COD, while `createIntent` only builds Razorpay orders. Either remove or hide unsupported methods from customer flows, or complete each provider’s intent, confirm, and webhook story.

- **Refund and partial-capture rigor.** Refund tables exist in the schema, but there is no first-class refund router in the main API composition alongside orders and payments. Production needs staff-initiated refunds, provider reconciliation, idempotency, and inventory/points reversal where applicable.

- **Webhook amount reconciliation.** Razorpay webhooks verify signatures and update status, but should compare captured amounts to `order.grandTotal` / `payment.amount` to detect partial payments, tampering, or configuration mistakes.

- **Idempotency of payment creation.** Creating a new pending payment row on every intent without consolidating duplicates can leave orphaned payments and complicate reconciliation. Define one active intent per order or explicit cancel/replace semantics.

- **Guest checkout policy.** Order creation is tied to `customerProcedure` (authenticated customers). If the business requires guest checkout, you need anonymous cart-to-order bridging and fraud controls; if not, the UX and marketing must make sign-in mandatory without dead ends.

- **Product discovery at scale.** Browsing is hierarchy-driven; a small catalog may suffice, but search, filters, and SEO-friendly listing pages are often expected for launch. Plan explicit scope: either document “category-only MVP” or add search and faceted navigation.

---

## Missing production requirements (security and privacy)

- **Strict env schema.** Adopt `@t3-oss/env-nextjs` or equivalent Zod validation: require `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, payment secrets, and webhook secrets in production; reject boot or tRPC context build when invalid.

- **Uniform abuse and rate limits.** Arcjet protects Better Auth POST routes; the main tRPC surface (`/api/v1`) and file upload routes lack the same class of protection. Layer per-IP and per-user limits on expensive and sensitive procedures.

- **Global security headers and optional CSP.** Today `next.config` sets Permissions-Policy for Razorpay. A production hardening pass should add HSTS (platform-level), frame protections, and a content security policy appropriate to your scripts and payment iframes.

- **Vercel Blob uploads.** The upload route accepts files for any authenticated user with no documented type/size limits or role restriction. Restrict to staff or to specific MIME types and sizes; scan or quarantine if user-generated content is public.

- **Cookie consent and audit logging.** New cookie and privacy modules must align with what you actually store: if consent logs retain IP or user-agent, privacy notices and retention limits must say so; hash or minimize identifiers where possible and document lawful basis for single-country vs future multi-region expansion.

- **Server Actions and mutations.** Treat every mutation like a public API: validate inputs, authorize roles inside handlers, and log security-sensitive changes—consistent with hardened expectations.

---

## Missing production requirements (admin, operations, and data honesty)

- **Studio dashboard metrics are placeholders.** The studio home page shows static dollar figures and order counts, not database-backed KPIs. Operators will make wrong decisions; replace with real aggregates or remove claims until wired.

- **Role matrix coverage.** Studio routes use session checks, and a `proxy` guards `/studio` paths for staff/admin. Audit every admin mutation in tRPC for consistent `staffProcedure` / `adminProcedure` use so no procedure leaks through alternate entry points.

- **Operational runbooks.** There is no root README for deployers: database migrations, seed strategy, webhook registration, Resend domain verification, and Razorpay dashboard steps should live in one place.

- **Carrier integrations.** Fulfillment appears compatible with manual tracking entry; if you promise live rates or labels, document “manual phase” or integrate carriers.

---

## Missing production requirements (quality, CI, and accessibility)

- **Automated tests for critical paths.** `package.json` has no `test` script beyond an inventory script; there is no Playwright or Vitest suite for auth, checkout, webhooks, or admin. Add the minimum: checkout happy path, payment webhook signature failure/success, and order access control regression.

- **Continuous integration.** No `.github/workflows` (or equivalent) enforces `pnpm run check` and `pnpm run build` on every change. Without CI, production regressions ship silently.

- **Pre-push discipline.** Husky’s `pre-push` hook has `pnpm run check` commented out, so local gates are opt-in only.

- **Lint and accessibility debt.** `biome.json` disables unused-variable checks, exhaustive hook dependencies, and most a11y rules. That speeds early development but conflicts with “no compromise” launch; progressively re-enable rules or add `eslint-plugin-jsx-a11y` for storefront pages.

---

## Missing production requirements (observability and reliability)

- **Structured server logging.** Winston is a dependency but debug-style helpers are primary; production benefits from structured logs, correlation IDs, and log levels wired to your host’s collector.

- **Sentry release and source map strategy.** `withSentryConfig` disables release creation and source maps, which is fine if intentional, but then you need another way to map minified stack traces to source (e.g. upload maps privately in CI).

- **Health and readiness endpoints.** Load balancers and orchestrators expect `/health` or similar; define lightweight DB-free pings vs deep checks.

- **Alerting.** Strong observability implies alerts on error rates, webhook failures, payment mismatches, and auth anomaly spikes—not only dashboards.

---

## Missing production requirements (deployment and documentation)

- **Root README and operator docs.** README fragments exist under `src` but not at repo root for “how to run, migrate, and deploy.”

- **Engine pinning.** Consider `engines` in `package.json` or `.nvmrc` so local and CI Node versions match Next 16 expectations.

- **Secret hygiene.** Ensure Sentry org/project slugs in `next.config` are appropriate for production; document rotation for Razorpay and Better Auth secrets.

---

## What already exists (foundation)

- **Modern stack.** Next.js 16, React 19, strict TypeScript, tRPC 11 with TanStack Query, Drizzle ORM, PostgreSQL, Better Auth with verification, reset, GitHub OAuth, passkeys, 2FA, and role concepts documented in `auth.md`.

- **Core commerce surfaces.** Storefront catalog by category hierarchy, cart, checkout flow wiring order creation and Razorpay, webhooks, configurable shipping zones/rates/methods in schema and modules, shipments module, account area (addresses, orders, wishlist, reviews, settings/privacy work in progress).

- **Backoffice (Studio).** Substantial routes for catalog, inventory, warehouses, orders, payments listing, discounts, marketing content, shipping configuration, and users.

- **Observability hooks.** Sentry server/edge/client, Vercel Analytics with consent gating, Arcjet on auth POST routes.

- **Email.** Resend and react-email for transactional messaging.

- **Rich schema.** Tax, loyalty, cart abandonment, refunds, consent audit tables—many hooks for future phases even where routers or UI are not complete.

---

## Suggested execution order

1. Fix pricing integrity: server-computed checkout preview API, align `CheckoutSummary` with persisted order and Razorpay amount; add tax line to order persistence as rules dictate.

2. Harden payments: derive payment status from verified data; reconcile webhook amounts; tighten intent idempotency.

3. Close authorization bugs on `order.get` and audit similar `get-by-id` procedures.

4. Enforce inventory presence or explicit non-stock semantics; fail closed on missing inventory for stock-tracked SKUs.

5. Implement strict env validation and rename or alias Arcjet env keys so docs and code agree.

6. Add CI, restore pre-push checks, and minimal critical-path tests (checkout + webhook + authz).

7. Replace placeholder Studio metrics or remove until real.

8. Tighten Blob uploads, expand rate limiting to tRPC hot paths, document deployment and privacy in a root README and data map.

---

*This audit reflects the repository state at authoring time; prioritize items with your legal and payment advisors for your specific jurisdiction.*
