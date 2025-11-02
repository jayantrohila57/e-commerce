import { createORPCContext } from '@/core/orpc/orpc.server'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { appRouter } from '@/core/orpc/orpc.router'
import { interceptors, orpcPlugins } from '@/core/orpc/orpc.config'

const handler = new OpenAPIHandler(appRouter, {
  interceptors: [async ({ next }) => await interceptors({ next })],
  plugins: orpcPlugins,
})

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: '/api/orpc',
    context: await createORPCContext(request),
  })

  return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
