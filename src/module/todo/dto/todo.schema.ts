import { baseFilterSchema, baseResponse, updateBaseSchema } from '@/shared/schema/common'
import { pgTable, serial, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod'

import { z } from 'zod'

export const statusEnum = pgEnum('status', ['pending', 'in_progress', 'done'])
export const labelEnum = pgEnum('label', ['personal', 'work', 'study', 'urgent', 'misc'])

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  status: statusEnum().notNull().default('pending'),
  label: labelEnum().notNull().default('misc'),
  priority: integer('priority').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

const todoSelectSchema = createSelectSchema(todos)
const todoInsertSchema = createInsertSchema(todos)
const todoUpdateSchema = createUpdateSchema(todos)

const todosSchema = {
  get: {
    input: todoSelectSchema.pick({
      id: true
    }),
    output: baseResponse.extend({
      data: todoSelectSchema
    })
  },
  getMany: {
    input: baseFilterSchema.extend({
      filters: todoSelectSchema.pick({
        status: true,
        label: true,
        priority: true
      })
    }),
    output: baseResponse.extend({
      data: todoSelectSchema.array()
    })
  },
  create: {
    input: todoInsertSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true
    }),
    output: baseResponse.extend({
      data: todoSelectSchema
    })
  },
  update: {
    input: updateBaseSchema.extend({
      data: todoUpdateSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true
      })
    }),
    output: baseResponse.extend({
      data: todoSelectSchema
    })
  },
  delete: {
    input: updateBaseSchema,
    output: baseResponse
  }
}

export default todosSchema

export type GetTodoInput = z.infer<typeof todosSchema.get.input>
export type GetTodoOutput = z.infer<typeof todosSchema.get.output>

export type GetManyTodoInput = z.infer<typeof todosSchema.getMany.input>
export type GetManyTodoOutput = z.infer<typeof todosSchema.getMany.output>

export type CreateTodoInput = z.infer<typeof todosSchema.create.input>
export type CreateTodoOutput = z.infer<typeof todosSchema.create.output>

export type UpdateTodoInput = z.infer<typeof todosSchema.update.input>
export type UpdateTodoOutput = z.infer<typeof todosSchema.update.output>

export type DeleteTodoInput = z.infer<typeof todosSchema.delete.input>
export type DeleteTodoOutput = z.infer<typeof todosSchema.delete.output>
