import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function updateWorkspace(app: FastifyInstance) {
  app.put('/workspaces/:id', { onRequest: [verifyJwt] }, async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid().min(1),
    })
    const bodySchema = z.object({
      name: z.string().min(1),
    })

    const { id } = paramsSchema.parse(request.params)
    const { name } = bodySchema.parse(request.body)

    const userId = request.user.sub

    const workspaceFromId = await prisma.workspace.findFirst({
      where: {
        id,
      },
    })

    if (!workspaceFromId) {
      throw new Error('Workspace not found')
    }

    const memberFromUserIdAndWorkspaceId = await prisma.member.findFirst({
      where: {
        workspaceId: workspaceFromId.id,
        userId,
        role: {
          in: ['OWNER', 'ADMIN'],
        },
      },
    })

    if (!memberFromUserIdAndWorkspaceId) {
      throw new Error('Not permitted')
    }

    const workspace = await prisma.workspace.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    return { workspace }
  })
}
