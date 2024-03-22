import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function updateOrganization(app: FastifyInstance) {
  app.put('/organizations/:id', { onRequest: [verifyJwt] }, async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid().min(1),
    })
    const bodySchema = z.object({
      name: z.string().min(1),
      type: z.enum(['PERSONAL', 'COMPANY']),
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, type } = bodySchema.parse(request.body)

    const userId = request.user.sub

    const organizationFromId = await prisma.organization.findFirst({
      where: {
        id,
      },
    })

    if (!organizationFromId) {
      throw new Error('Organization not found')
    }

    const memberFromUserIdAndOrganizationId = await prisma.member.findFirst({
      where: {
        organizationId: organizationFromId.id,
        userId,
        role: {
          in: ['OWNER', 'ADMIN'],
        },
      },
    })

    if (!memberFromUserIdAndOrganizationId) {
      throw new Error('Not permitted')
    }

    const organization = await prisma.organization.update({
      where: {
        id,
      },
      data: {
        name,
        type,
      },
    })

    return { organization }
  })
}
