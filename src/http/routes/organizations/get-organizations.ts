import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function getOrganizations(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get organizations',
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

      const organizationsFromUserId = await prisma.organization.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
      })

      return {
        organizations: organizationsFromUserId,
      }
    },
  )
}
