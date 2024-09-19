import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get user',
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      onRequest: [verifyJwt],
    },
    async (request, reply) => {
      const userId = request.user.sub

      const userFromId = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      })

      if(!userFromId
       ) {
        throw new UnauthorizedError()
       }

      return reply.send({
        user: userFromId,
      })
    },
  )
}
