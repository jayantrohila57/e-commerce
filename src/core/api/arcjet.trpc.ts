import arcjet, { slidingWindow } from "@arcjet/next";
import { serverEnv } from "@/shared/config/env.server";

const key = serverEnv.ARKJET_API_KEY?.trim();

const aj =
  key.length > 0
    ? arcjet({
        key,
        rules: [
          slidingWindow({
            mode: "LIVE",
            max: 300,
            interval: "1m",
          }),
        ],
      })
    : null;

/** Rate-limit anonymous tRPC traffic when Arcjet is configured. */
export async function guardTrpcRateLimit(request: Request): Promise<Response | null> {
  if (!aj || serverEnv.NODE_ENV === "development") return null;
  const decision = await aj.protect(request);
  if (decision.isDenied()) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }
  return null;
}
