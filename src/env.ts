import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number(),

  DATABASE_URL: z.string().url().min(1),

  RESEND_KEY: z.string().min(1),

  JWT_SECRET: z.string().min(1),
})

export const env = envSchema.parse(process.env)
