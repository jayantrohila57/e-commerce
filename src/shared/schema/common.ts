import z from "zod/v3";
import { STATUS } from "../config/api.config";

export const baseFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  sort: z
    .object({
      column: z.string(),
      order: z.enum(["asc", "desc"]),
    })
    .optional(),
  filters: z.object({}).optional(),
});

export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum([STATUS.SUCCESS, STATUS.ERROR, STATUS.FAILED]),
    message: z.string(),
    data: dataSchema.nullable().optional(),
    code: z.number().nullable().optional(),
  });

export const updateBaseSchema = z.object({
  id: z.number(),
  data: z.object({}),
});
