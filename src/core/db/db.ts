import { env } from '@/shared/config/env'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
import { neon } from '@neondatabase/serverless'

const sql = neon(env.DATABASE_URL)

config({ path: '.env', quiet: true })

export const db = drizzle(sql, { schema })
