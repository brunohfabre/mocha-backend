import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function getWorkspace(app: FastifyInstance) {
  app.get('/workspaces/:id', { onRequest: [verifyJwt] }, async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid().min(1),
    })

    const { id } = paramsSchema.parse(request.params)

    const userId = request.user.sub

    const workspaceFromIdAndUserId = await prisma.workspace.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
    })

    if (!workspaceFromIdAndUserId) {
      throw new Error('Workspace not found')
    }

    return {
      workspace: workspaceFromIdAndUserId,
    }
  })
}
