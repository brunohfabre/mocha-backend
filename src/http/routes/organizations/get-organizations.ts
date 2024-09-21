import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function getOrganizations(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Organizations'],
        summary: 'Get organizations',
      },
    },
    async (request) => {
     const userId = request.user.sub

      const organizations = await prisma.organization.findMany({
        where: {
          members: {
            some: {
              userId
            }
          }
        }
      })

      return {
        organizations,
      }
    },
  )
}
