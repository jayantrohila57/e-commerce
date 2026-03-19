# Screen Task Backlog

Generated from `flow.md` on `2026-03-16`.

## Scope Notes

- This backlog is route-first and screen-based.
- Fully complete screens with no meaningful gap from `flow.md` are not repeated here.
- Priorities are pragmatic, not purely technical: broken money paths and broken navigation come first.

## Priority Guide

- `P0`: Broken core journey, security gap, or routing issue that can mislead users or block revenue.
- `P1`: Important product flow missing or materially incomplete.
- `P2`: Useful improvement, performance fix, or UX completion item.
- `P3`: Polish, governance, or operational enhancement.

## Priority Summary

- `P0`: Route integrity, checkout/PDP correctness, auth protection.
- `P1`: Support flows, account gaps, studio admin gaps.
- `P2`: Content quality, UX hardening, performance cleanup.
- `P3`: Polish, monitoring, long-tail improvements.

## P0 Tasks

- **Fix PDP purchase path** (`P0`)
Screens: `/store/[categorySlug]/[subCategorySlug]/[variantSlug]`
Description: Wire the `Buy Now` button to a real purchase action and normalize product pricing display to the same currency rules used elsewhere.
Expected effect: Restores a direct conversion path from PDP and removes pricing confusion.
- **Make checkout totals authoritative** (`P0`)
Screens: `/store/checkout`
Description: Replace the hardcoded free-shipping and fixed-tax sidebar values with selected shipping method pricing and server-calculated totals.
Expected effect: Users see correct order totals before paying, reducing payment drop-off and trust issues.
- **Resolve cart access model** (`P0`)
Screens: Header cart, `/account/cart`, guest cart flow
Description: Either add a public cart route for guest carts or remove the mixed guest-cart/account-only behavior and force a single clear access model.
Expected effect: Eliminates a broken transition between guest cart state and account-only cart pages.
- **Fix route integrity and broken links** (`P0`)
Screens: `/support/contact-support`, `/newsletter`, `/profile`, `/store/products/`*, `/studio/inventory/new`, `/studio/users/new`, footer dead links
Description: Align `PATH` constants, footer links, sidebar links, and CTA destinations with real routes or remove links that do not have a screen behind them.
Expected effect: Removes dead navigation and prevents users and admins from landing on missing pages.
- **Verify and widen Arcjet auth path protection** (`P0`)
Screens: `/api/auth/[...all]`
Description: Confirm the exact Better Auth POST endpoints in use and update Arcjet matching so sign-in and sign-up traffic is actually protected in all supported auth flows.
Expected effect: Reduces the chance of leaving real auth endpoints outside the intended abuse-protection layer.

## P1 Tasks

- **Build newsletter capture flow** (`P1`)
Screens: `/marketing/newsletter`
Description: Add an email form, submission handler, success state, and fix the footer link to the correct route.
Expected effect: Turns a placeholder marketing page into a usable lead-capture screen.
- **Replace placeholder copy with real brand content** (`P1`)
Screens: `/marketing/about`
Description: Use structured content blocks or a dedicated content model for company story, mission, and trust content.
Expected effect: Makes the page useful for brand trust instead of acting like a stub.
- **Turn support root into a real support hub** (`P1`)
Screens: `/support`
Description: Add clear entry points for contact, FAQ, shipping, returns, and ticket actions instead of a placeholder title.
Expected effect: Gives users an actual support decision point instead of a dead hub.
- **Add support request submission** (`P1`)
Screens: `/support/contact`
Description: Build a contact form or route users into a real ticket creation flow with channel details and SLA guidance.
Expected effect: Provides a usable support escalation path.
- **Build structured self-serve support content** (`P1`)
Screens: `/support/faq`, `/support/help-center`
Description: Add FAQ data, article groupings, and search or browse behavior.
Expected effect: Deflects support load and gives users self-serve answers.
- **Replace static copy with real operational flows** (`P1`)
Screens: `/support/returns`, `/support/shipping`
Description: Add return policy detail, shipping zones, ETA guidance, and entry points for return and tracking actions.
Expected effect: Makes support content actionable instead of decorative.
- **Create the ticket domain and UI** (`P1`)
Screens: `/support/tickets`, `/support/tickets/[ticketId]`
Description: Add ticket schema, queries, mutations, list/detail screens, status updates, and comments.
Expected effect: Unlocks a real authenticated support workflow end to end.
- **Build a proper legal landing page** (`P1`)
Screens: `/legal`
Description: Populate the empty right column with policy cards, summaries, or onboarding context to the legal section.
Expected effect: Improves discoverability and makes the legal area feel complete.
- **Implement invoice screen** (`P1`)
Screens: `/account/order/[id]/invoice`
Description: Render invoice data, totals, billing and shipping details, and print or download behavior from the existing order and payment data.
Expected effect: Completes a major post-purchase user expectation.
- **Fix email-change callback routing** (`P1`)
Screens: `/account`
Description: Replace the missing `/profile` callback target with a real account route.
Expected effect: Prevents broken return flows during profile and email updates.
- **Build account settings screen** (`P1`)
Screens: `/account/setting`
Description: Add actual settings sections for profile preferences, notifications, security preferences, or connected providers.
Expected effect: Converts an empty shell into a usable account-management screen.
- **Decide and implement the review surface** (`P1`)
Screens: `/account/review`
Description: Either build the review management flow or remove or defer the screen until the review domain exists.
Expected effect: Avoids shipping a visible dead-end account route.
- **Remove sequential per-order lookup pattern** (`P1`)
Screens: `/account/payment`, `/account/shipment`
Description: Replace the current N+1 style aggregation with more direct server queries or batched joins.
Expected effect: Improves page load time and scalability for active customers.
- **Replace placeholder admin dashboard metrics** (`P1`)
Screens: `/studio`
Description: Swap hardcoded metrics and cards with live order, payment, shipment, and catalog KPIs.
Expected effect: Makes the landing screen useful for staff instead of ornamental.
- **Finish subcategory detail screen** (`P1`)
Screens: `/studio/catalog/categories/[categorySlug]/[subCategorySlug]`
Description: Implement the missing product listing and related management actions currently called out as TODO.
Expected effect: Completes an important admin drilldown route.
- **Replace placeholder with real edit form** (`P1`)
Screens: `/studio/catalog/categories/[categorySlug]/[subCategorySlug]/edit-subcategory`
Description: Build the actual subcategory edit flow or remove the route until it exists.
Expected effect: Removes a false-positive admin path that currently behaves like a debug page.
- **Decide whether series is a real domain** (`P1`)
Screens: `/studio/catalog/categories/[categorySlug]/[subCategorySlug]/[seriesSlug]`
Description: Either implement a proper series detail screen or delete the route if series management is not a supported concept.
Expected effect: Cleans up admin information architecture and prevents permanent placeholder debt.
- **Fix store-view linkage and harden missing-state handling** (`P1`)
Screens: `/studio/catalog/products`, `/studio/catalog/products/[productSlug]`
Description: Point "view in store" actions to a real customer-facing path and add stronger `notFound()` handling where product data can be missing.
Expected effect: Prevents broken admin-to-store navigation and makes detail pages safer.
- **Complete inventory management flow** (`P1`)
Screens: `/studio/inventory`, `/studio/inventory/[inventoryId]`, `/studio/inventory/[inventoryId]/edit-inventory`
Description: Add the missing create screen or remove the CTA, add explicit not-found handling, and either wire or remove the "Save Draft" action.
Expected effect: Turns inventory management into a consistent CRUD flow instead of a partial one.
- **Wire currently inert admin actions** (`P1`)
Screens: `/studio/orders/[orderId]`
Description: Implement or remove buttons such as invoice sending, printing, or any order actions that currently do nothing.
Expected effect: Reduces operator confusion and makes the order detail screen trustworthy.
- **Finish user-management filters and create flow** (`P1`)
Screens: `/studio/users`
Description: Pass `banned` and `emailVerified` filters through to the data query and add or remove the missing create-user route and CTA.
Expected effect: Makes admin filtering accurate and removes a broken empty-state path.

## P2 Tasks

- **Improve home fallback and metadata quality** (`P2`)
Screens: `/`
Description: Add empty states for missing marketing content and replace placeholder metadata and copy with real storefront messaging.
Expected effect: Makes the homepage more resilient in low-content environments.
- **Resolve commented-out merchandising sections** (`P2`)
Screens: `/store/[categorySlug]`, `/store/[categorySlug]/[subCategorySlug]`
Description: Decide which disabled sections should return, then either restore them cleanly or remove the dead code paths.
Expected effect: Simplifies maintenance and clarifies the intended store browsing experience.
- **Add invalid-order recovery UX** (`P2`)
Screens: `/store/checkout/confirmation`
Description: Replace redirect-only handling with a clear recovery state when `orderId` is missing or invalid.
Expected effect: Gives customers a better recovery path after payment callbacks fail.
- **Polish auth UX and compliance details** (`P2`)
Screens: `/auth/sign-up`, `/auth/reset-password`, `/auth/verify-email`, shared auth shell
Description: Add an explicit consent checkbox if required, fix the support route, add a refresh or check action for verification, and replace `support@yourapp.com`.
Expected effect: Tightens auth UX and removes obvious placeholder details.
- **Remove dependence on list-page state** (`P2`)
Screens: `/account/address/[id]/edit`
Description: Fetch the address directly for edit rather than assuming the list query already contains the record.
Expected effect: Makes edit URLs reliable when opened directly.
- **Add upload validation and guardrails** (`P2`)
Screens: `/api/blob/upload`
Description: Validate MIME type, file size, and failure modes rather than only checking auth and file presence.
Expected effect: Reduces abuse risk and improves admin upload reliability.
- **Prune or implement long-tail footer destinations** (`P2`)
Screens: Footer links and site navigation
Description: Decide whether `/orders/track`, `/support/size-guide`, `/store/new`, `/store/best-sellers`, `/store/sale`, and `/store/gift-cards` are real roadmap items.
Expected effect: Removes low-quality navigation and keeps the information architecture honest.
- **Clarify wishlist accessibility** (`P2`)
Screens: `/account/wishlist` and store wishlist entry points
Description: Decide whether wishlist should remain account-only or be reachable from public storefront flows in a clearer way.
Expected effect: Improves consistency between save-for-later intent and actual access points.

## P3 Tasks

- **Add governance metadata** (`P3`)
Screens: `/legal/[slug]`, `/legal`
Description: Surface review dates, ownership, or revision history for legal content if compliance visibility matters.
Expected effect: Improves maintainability and trust for policy pages.
- **Evaluate stronger auth options** (`P3`)
Screens: `/auth/sign-in`, `/auth/sign-up`
Description: Consider passkeys or additional providers once the current auth flow is stable.
Expected effect: Improves conversion and long-term account security.
- **Reduce duplicate shells and tighten consistency** (`P3`)
Screens: Global loading, error, and not-found screens
Description: Review duplicate studio loading states and align error and 404 experiences across route groups.
Expected effect: Lowers maintenance overhead and keeps shared UX coherent.
- **Add operational metrics and alerting** (`P3`)
Screens: `/api/webhooks/razorpay` and payment operations
Description: Track webhook failures, retries, and reconciliation errors more explicitly.
Expected effect: Improves production observability for payments.

## Suggested Execution Order

- Finish all `P0` route and checkout tasks first.
- Then close the `P1` account and studio admin gaps that break operator or buyer workflows.
- Build support pages only after deciding whether support is ticket-driven, form-driven, or content-driven.
- Keep public marketing and support content tied to real data models where reuse already exists.
- Remove placeholder routes aggressively if their domain model is not actually on the roadmap.

## Suggestions

- Treat route hygiene as its own mini-project. A lot of confusion in the app currently comes from constants, footer links, and CTA targets pointing to paths that do not exist.
- Keep the customer purchase path strict: PDP -> cart -> checkout -> confirmation -> invoice. That path should be fully correct before adding more marketing pages.
- Do not build support ticket screens before defining the ticket schema, ownership rules, status model, and whether anonymous users can create tickets.
- Reuse the working studio CRUD patterns. Categories, attributes, payments, shipping, and marketing content already show the right pattern to copy.
- Where a screen is just a placeholder shell, decide early whether it should become CMS-backed content, a real application flow, or be removed.
- Any page that can be opened directly by URL should fetch its own source record and handle missing data explicitly.
- Avoid keeping "debug" or "future phase" screens visible in navigation unless they already provide value.

