/**
 * tRPC HTTP adapter for the App Router. Context includes Better Auth session and `guestCartSessionId`
 * from the `cart_session_id` cookie (see `createTRPCContext`). Arcjet rate limits apply to GET and POST when configured.
 */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { createTRPCContext } from "@/core/api/api.methods";
import { appRouter } from "@/core/api/api.routes";
import { guardTrpcRateLimit } from "@/core/api/arcjet.trpc";
import { serverEnv } from "@/shared/config/env.server";
import { debugLog } from "@/shared/utils/lib/logger.utils";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/v1",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: ({ path, error }) => {
      if (serverEnv.NODE_ENV === "development") {
        debugLog(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
        return;
      }
      const code = "code" in error ? String((error as { code: unknown }).code) : undefined;
      debugLog(`tRPC error`, { path: path ?? "<no-path>", code, message: error.message });
    },
  });

async function guarded(req: NextRequest) {
  const denied = await guardTrpcRateLimit(req);
  if (denied) return denied;
  return handler(req);
}

export { guarded as GET, guarded as POST };
