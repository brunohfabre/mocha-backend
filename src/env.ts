import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'staging', 'production']),

  JWT_SECRET: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),
})

export const env = envSchema.parse(process.env)
