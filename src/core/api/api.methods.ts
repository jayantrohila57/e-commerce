import "server-only";

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod/v3";
import { getServerSession } from "../auth/auth.server";
import { API_RESPONSE, prettyZodError, zodErrorObject } from "@/shared/config/api.utils";
import { STATUS } from "@/shared/config/api.config";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { session, user } = await getServerSession();

  return {
    session,
    user,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (error.cause instanceof ZodError) {
      return API_RESPONSE(STATUS.FAILED, String(prettyZodError(error.cause)), zodErrorObject(error.cause));
    }
    return API_RESPONSE(STATUS.ERROR, String(error.message || "Something went wrong"), shape.data.code);
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const enforceUser = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

const enforceRole = (roles: string[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    if (!roles.includes(ctx.user.role!)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUser);
export const adminProcedure = t.procedure.use(enforceUser).use(enforceRole(["admin"]));
export const customerProcedure = t.procedure.use(enforceUser).use(enforceRole(["admin", "user"]));
