import { site } from '@/shared/config/site'
import { debugLog } from '@/shared/utils/lib/logger.utils'
import { ValidationError } from '@orpc/contract'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod'
import { ORPCError } from '@orpc/server'
import { z } from 'zod'

const handleErrors = (error: Error) => {
  if (error instanceof ORPCError && error.code === 'BAD_REQUEST' && error.cause instanceof ValidationError) {
    const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[])
    const validationError = {
      status: 422,
      message: z.prettifyError(zodError),
      data: z.flattenError(zodError),
    }
    debugLog('INTERCEPTOR:VALIDATION_ERROR', validationError)
  }
  debugLog('INTERCEPTOR:ERROR', error)
}

export const interceptors = async <T>({ next }: { next: () => Promise<T> }): Promise<T> => {
  try {
    return await next()
  } catch (error: unknown) {
    handleErrors(error as Error)
    return await next()
  }
}

export const orpcPlugins = [
  new OpenAPIReferencePlugin({
    docsProvider: 'scalar',
    schemaConverters: [new ZodToJsonSchemaConverter()],
    specGenerateOptions: {
      info: {
        title: site.apiTitle,
        version: site.apiVersion,
      },
    },
  }),
]
