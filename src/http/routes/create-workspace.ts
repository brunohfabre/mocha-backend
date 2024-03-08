import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function createWorkspace(app: FastifyInstance) {
  app.post(
    '/workspaces',
    { onRequest: [verifyJwt] },
    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string().min(1),
      })

      const { name } = bodySchema.parse(request.body)

      const userId = request.user.sub

      const workspace = await prisma.workspace.create({
        data: {
          name,
          members: {
            create: {
              userId,
              role: 'OWNER',
            },
          },
        },
      })

      return { workspace }
    },
  )
}
