import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function getOrganization(app: FastifyInstance) {
  app.get('/organizations/:id', { onRequest: [verifyJwt] }, async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid().min(1),
    })

    const { id } = paramsSchema.parse(request.params)

    const userId = request.user.sub

    const organizationFromIdAndUserId = await prisma.organization.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
    })

    if (!organizationFromIdAndUserId) {
      throw new Error('Organization not found')
    }

    return {
      organization: organizationFromIdAndUserId,
    }
  })
}
