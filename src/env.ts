import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),

  JWT_SECRET: z.string(),

  RESEND_KEY: z.string(),

  GITHUB_OAUTH_CLIENT_ID: z.string(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
