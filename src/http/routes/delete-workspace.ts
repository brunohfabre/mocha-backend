import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function deleteWorkspace(app: FastifyInstance) {
  app.delete('/workspaces/:id', { onRequest: [verifyJwt] }, async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid().min(1),
    })

    const { id } = paramsSchema.parse(request.params)

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
        role: 'OWNER',
      },
    })

    if (!memberFromUserIdAndWorkspaceId) {
      throw new Error('Not permitted')
    }

    await prisma.workspace.delete({
      where: { id },
    })
  })
}
