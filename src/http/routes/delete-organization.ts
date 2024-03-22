import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function deleteOrganization(app: FastifyInstance) {
  app.delete(
    '/organizations/:id',
    { onRequest: [verifyJwt] },
    async (request) => {
      const paramsSchema = z.object({
        id: z.string().uuid().min(1),
      })

      const { id } = paramsSchema.parse(request.params)

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
          role: 'OWNER',
        },
      })

      if (!memberFromUserIdAndOrganizationId) {
        throw new Error('Not permitted')
      }

      await prisma.organization.delete({
        where: { id },
      })
    },
  )
}
