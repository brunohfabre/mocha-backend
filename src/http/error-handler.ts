import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './errors/bad-request-error'
import { UnauthorizedError } from './errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    reply.status(401).send({
      message: error.message,
    })
  }

  console.error(error)

  // send error to some observability platform

  reply.status(500).send({ message: 'Internal server error' })
}
