import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.string(),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
