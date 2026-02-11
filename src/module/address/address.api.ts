import { createTRPCRouter, protectedProcedure } from '@/core/api/api.methods'
import { db } from '@/core/db/db'
import { shippingAddress } from '@/core/db/db.schema'
import { MESSAGE, STATUS } from '@/shared/config/api.config'
import { API_RESPONSE } from '@/shared/config/api.utils'
import { debugError } from '@/shared/utils/lib/logger.utils'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { shippingAddressContract } from './address.schema'
import type { ShippingAddress } from './address.types'

export const addressRouter = createTRPCRouter({
  getUserAddresses: protectedProcedure
    .input(shippingAddressContract.getUserAddresses.input)
    .output(shippingAddressContract.getUserAddresses.output)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id

        const items = (await db.query.shippingAddress.findMany({
          where: (t, { and, eq, isNull }) => and(eq(t.userId, userId), isNull(t.deletedAt)),
          limit: input.query?.limit ?? undefined,
          offset: input.query?.offset ?? undefined,
          orderBy: (t, { desc }) => desc(t.createdAt),
        })) as ShippingAddress[]

        return API_RESPONSE<ShippingAddress[]>(STATUS.SUCCESS, MESSAGE.ADDRESS.GET_USER_ADDRESSES.SUCCESS, items)
      } catch (err) {
        debugError('ADDRESS:GET_USER_ADDRESSES:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.ADDRESS.GET_USER_ADDRESSES.ERROR, null, error)
      }
    }),

  get: protectedProcedure
    .input(shippingAddressContract.get.input)
    .output(shippingAddressContract.get.output)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const { id } = input.params

        const item = (await db.query.shippingAddress.findFirst({
          where: (t, { and, eq, isNull }) => and(eq(t.id, id), eq(t.userId, userId), isNull(t.deletedAt)),
        })) as ShippingAddress | null

        if (!item) {
          return API_RESPONSE(STATUS.FAILED, MESSAGE.ADDRESS.GET.FAILED, null)
        }

        return API_RESPONSE<ShippingAddress | null>(STATUS.SUCCESS, MESSAGE.ADDRESS.GET.SUCCESS, item)
      } catch (err) {
        debugError('ADDRESS:GET:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.ADDRESS.GET.ERROR, null, error)
      }
    }),

  create: protectedProcedure
    .input(shippingAddressContract.create.input)
    .output(shippingAddressContract.create.output)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const body = input.body

        // If isDefault is set, clear other defaults
        if (body.isDefault) {
          await db.update(shippingAddress).set({ isDefault: false }).where(eq(shippingAddress.userId, userId))
        }

        const [raw] = await db
          .insert(shippingAddress)
          .values({ id: uuidv4(), userId, ...body })
          .returning()

        const created = (await db.query.shippingAddress.findFirst({
          where: (t, { eq }) => eq(t.id, raw.id),
        })) as ShippingAddress | null

        return API_RESPONSE<ShippingAddress | null>(STATUS.SUCCESS, MESSAGE.ADDRESS.CREATE.SUCCESS, created)
      } catch (err) {
        debugError('ADDRESS:CREATE:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.ADDRESS.CREATE.ERROR, null, error)
      }
    }),

  update: protectedProcedure
    .input(shippingAddressContract.update.input)
    .output(shippingAddressContract.update.output)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const { id } = input.params
        const body = input.body

        const existing = await db.query.shippingAddress.findFirst({
          where: (t, { and, eq }) => and(eq(t.id, id), eq(t.userId, userId)),
        })
        if (!existing) return API_RESPONSE(STATUS.FAILED, MESSAGE.ADDRESS.UPDATE.FAILED, null)

        if (body.isDefault) {
          await db.update(shippingAddress).set({ isDefault: false }).where(eq(shippingAddress.userId, userId))
        }

        const [updated] = await db
          .update(shippingAddress)
          .set({ ...body })
          .where(eq(shippingAddress.id, id))
          .returning()

        const hydrated = (await db.query.shippingAddress.findFirst({
          where: (t, { eq }) => eq(t.id, updated.id),
        })) as ShippingAddress | null

        return API_RESPONSE<ShippingAddress | null>(STATUS.SUCCESS, MESSAGE.ADDRESS.UPDATE.SUCCESS, hydrated)
      } catch (err) {
        debugError('ADDRESS:UPDATE:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.ADDRESS.UPDATE.ERROR, null, error)
      }
    }),

  delete: protectedProcedure
    .input(shippingAddressContract.delete.input)
    .output(shippingAddressContract.delete.output)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const { id } = input.params

        const existing = await db.query.shippingAddress.findFirst({
          where: (t, { and, eq }) => and(eq(t.id, id), eq(t.userId, userId)),
        })
        if (!existing) return API_RESPONSE(STATUS.FAILED, MESSAGE.ADDRESS.DELETE.FAILED, null)

        const [deleted] = await db
          .update(shippingAddress)
          .set({ deletedAt: new Date() })
          .where(eq(shippingAddress.id, id))
          .returning()

        const hydrated = (await db.query.shippingAddress.findFirst({
          where: (t, { eq }) => eq(t.id, deleted.id),
        })) as ShippingAddress | null

        return API_RESPONSE<ShippingAddress | null>(STATUS.SUCCESS, MESSAGE.ADDRESS.DELETE.SUCCESS, hydrated)
      } catch (err) {
        debugError('ADDRESS:DELETE:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.ADDRESS.DELETE.ERROR, null, error)
      }
    }),

  setDefault: protectedProcedure
    .input(shippingAddressContract.setDefault.input)
    .output(shippingAddressContract.setDefault.output)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user!.id
        const { id } = input.params

        // verify ownership
        const existing = await db.query.shippingAddress.findFirst({
          where: (t, { and, eq }) => and(eq(t.id, id), eq(t.userId, userId)),
        })
        if (!existing) return API_RESPONSE(STATUS.FAILED, MESSAGE.ADDRESS.UPDATE.FAILED, null)

        // clear other defaults
        await db.update(shippingAddress).set({ isDefault: false }).where(eq(shippingAddress.userId, userId))

        const [updated] = await db
          .update(shippingAddress)
          .set({ isDefault: true })
          .where(eq(shippingAddress.id, id))
          .returning()

        const hydrated = (await db.query.shippingAddress.findFirst({
          where: (t, { eq }) => eq(t.id, updated.id),
        })) as ShippingAddress | null

        return API_RESPONSE<ShippingAddress | null>(STATUS.SUCCESS, MESSAGE.ADDRESS.UPDATE.SUCCESS, hydrated)
      } catch (err) {
        debugError('ADDRESS:SET_DEFAULT:ERROR', err)
        const error = err instanceof Error ? err : new Error(String(err))
        return API_RESPONSE(STATUS.ERROR, MESSAGE.ADDRESS.UPDATE.ERROR, null, error)
      }
    }),
})

export default addressRouter
