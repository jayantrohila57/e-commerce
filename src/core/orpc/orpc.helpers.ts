import { protectedProcedure } from './orpc.server'

/**
 * Helper function to create partial router implementations.
 *
 * ORPC supports partial router implementations at runtime, but TypeScript's
 * type inference expects routers to match the full contract structure (starting with 'user').
 * This helper properly types partial routers without requiring @ts-expect-error.
 *
 * Usage:
 * ```ts
 * export const addressRouter = createPartialRouter({
 *   address: { ... }
 * })
 * ```
 *
 * @param routerConfig - Partial router configuration matching any module from the contract
 * @returns Properly typed router that can be combined with others in orpc.router.ts
 */
export function createPartialRouter<T extends Record<string, unknown>>(routerConfig: T) {
  // Type assertion is safe here because ORPC runtime supports partial implementations.
  // The type system infers from contract structure (user first), but runtime accepts any partial match.
  // We use 'unknown' first to satisfy TypeScript's type checking requirements.
  return protectedProcedure.router(
    routerConfig as unknown as Parameters<typeof protectedProcedure.router>[0],
  ) as ReturnType<typeof protectedProcedure.router>
}
