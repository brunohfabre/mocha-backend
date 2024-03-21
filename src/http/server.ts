import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from '@/env'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { PrismaClientInitializationError } from '@prisma/client/runtime/library'

import { appRoutes } from './routes'

const app = fastify()

app.register(fastifyCors)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: error.flatten(),
    })
  }

  if (error instanceof PrismaClientInitializationError) {
    return reply.status(502).send()
  }

  if (error instanceof Error) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => console.log(`🔥 HTTP server running on port ${env.PORT}!`))
