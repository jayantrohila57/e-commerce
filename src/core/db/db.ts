import { env } from '@/shared/config/env'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

config({ path: '.env', quiet: true })

export const db = drizzle(env.DATABASE_URL, { schema })
