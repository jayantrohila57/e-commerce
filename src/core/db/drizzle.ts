import 'server-only'
import { serverEnv } from '@/shared/config/env.server'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env' })

export default defineConfig({
  schema: './src/core/db/db.schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
})
