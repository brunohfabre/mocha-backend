import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number(),

  FRONTEND_URL: z.string().min(1).url(),

  DATABASE_URL: z.string().min(1).url(),

  RESEND_KEY: z.string().min(1),

  JWT_SECRET: z.string().min(1),
})

export const env = envSchema.parse(process.env)
