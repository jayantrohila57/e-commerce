import { seriesContract } from './series.schema'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/core/api/api.methods'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { db } from '@/core/db/db'
import { eq, and, ilike, isNull } from 'drizzle-orm'
import { series, attribute } from '@/core/db/db.schema'
import { v4 as uuidv4 } from 'uuid'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'

export const seriesRouter = createTRPCRouter({
  get: publicProcedure
    .input(seriesContract.get.input)
    .output(seriesContract.get.output)
    .query(async ({ input }) => {
      try {
        const output =
          (await db.query.series.findFirst({
            where: (s, { eq, and }) => and(eq(s.id, input.params.id), isNull(s.deletedAt)),
          })) ?? null

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SERIES.GET.SUCCESS : MESSAGE.SERIES.GET.FAILED,
          output,
        )
      } catch (err) {
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.GET.ERROR, null, err as Error)
      }
    }),

  getBySlug: publicProcedure
    .input(seriesContract.getBySlug.input)
    .output(seriesContract.getBySlug.output)
    .query(async ({ input }) => {
      try {
        const sData = await db.query.series.findFirst({
          where: (s, { eq, and }) => and(eq(s.slug, input.params.slug), isNull(s.deletedAt)),
        })

        const attrData = await db.query.attribute.findMany({
          where: (at, { eq, and }) => and(eq(at.seriesSlug, String(sData?.slug)), isNull(at.deletedAt)),
        })

        const output = {
          seriesData: sData ?? null,
          attributeData: attrData ?? [],
        }

        return API_RESPONSE(
          output.seriesData ? STATUS.SUCCESS : STATUS.FAILED,
          output.seriesData ? MESSAGE.SERIES.GET_BY_SLUG.SUCCESS : MESSAGE.SERIES.GET_BY_SLUG.FAILED,
          output,
        )
      } catch (err) {
        debugError('SERIES:GET_BY_SLUG', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.GET_BY_SLUG.ERROR, null, err as Error)
      }
    }),

  getMany: publicProcedure
    .input(seriesContract.getMany.input)
    .output(seriesContract.getMany.output)
    .query(async ({ input }) => {
      try {
        const filters = [isNull(series.deletedAt)]

        if (input.query?.search) filters.push(ilike(series.title, `%${input.query.search}%`))
        if (input.query?.subcategorySlug) filters.push(eq(series.subcategorySlug, input.query.subcategorySlug))

        const output = await db.query.series.findMany({
          where: and(...filters),
          limit: input.query?.limit ?? 20,
          offset: input.query?.offset ?? 0,
          orderBy: (s, { asc }) => [asc(s.displayOrder)],
        })

        return API_RESPONSE(
          output?.length ? STATUS.SUCCESS : STATUS.FAILED,
          output?.length ? MESSAGE.SERIES.GET_MANY.SUCCESS : MESSAGE.SERIES.GET_MANY.FAILED,
          output ?? [],
        )
      } catch (err) {
        debugError('SERIES:GET_MANY', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.GET_MANY.ERROR, [], err as Error)
      }
    }),

  create: protectedProcedure
    .input(seriesContract.create.input)
    .output(seriesContract.create.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .insert(series)
          .values({
            id: uuidv4(),
            ...input.body,
            slug: input.body.slug ?? input.body.title.toLowerCase().replace(/\s+/g, '-'),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SERIES.CREATE.SUCCESS : MESSAGE.SERIES.CREATE.FAILED,
          output,
        )
      } catch (err) {
        debugError('SERIES:CREATE', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.CREATE.ERROR, null, err as Error)
      }
    }),

  update: protectedProcedure
    .input(seriesContract.update.input)
    .output(seriesContract.update.output)
    .mutation(async ({ input }) => {
      try {
        const { params, body } = input

        const [output] = await db
          .update(series)
          .set({
            ...body,
            updatedAt: new Date(),
          })
          .where(eq(series.id, params.id))
          .returning()

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SERIES.UPDATE.SUCCESS : MESSAGE.SERIES.UPDATE.FAILED,
          output,
        )
      } catch (err) {
        debugError('SERIES:UPDATE', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.UPDATE.ERROR, null, err as Error)
      }
    }),

  delete: protectedProcedure
    .input(seriesContract.delete.input)
    .output(seriesContract.delete.output)
    .mutation(async ({ input }) => {
      try {
        const [output] = await db
          .update(series)
          .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(series.id, input.params.id))
          .returning({ id: series.id })

        return API_RESPONSE(
          output ? STATUS.SUCCESS : STATUS.FAILED,
          output ? MESSAGE.SERIES.DELETE.SUCCESS : MESSAGE.SERIES.DELETE.FAILED,
          output,
        )
      } catch (err) {
        debugError('SERIES:DELETE', err)
        return API_RESPONSE(STATUS.ERROR, MESSAGE.SERIES.DELETE.ERROR, null, err as Error)
      }
    }),
})
