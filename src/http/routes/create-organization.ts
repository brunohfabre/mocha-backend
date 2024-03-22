import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function createOrganization(app: FastifyInstance) {
  app.post('/organizations', { onRequest: [verifyJwt] }, async (request) => {
    const bodySchema = z.object({
      name: z.string().min(1),
      type: z.enum(['PERSONAL', 'COMPANY']),
    })

    const { name, type } = bodySchema.parse(request.body)

    const userId = request.user.sub

    const organization = await prisma.organization.create({
      data: {
        name,
        type,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    })

    return { organization }
  })
}
