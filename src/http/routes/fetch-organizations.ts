import { FastifyInstance } from 'fastify'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function fetchOrganizations(app: FastifyInstance) {
  app.get('/organizations', { onRequest: [verifyJwt] }, async (request) => {
    const userId = request.user.sub

    const organizations = await prisma.organization.findMany({
      where: {
        members: {
          every: {
            userId,
          },
        },
      },
    })

    return {
      organizations,
    }
  })
}
