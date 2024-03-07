import { FastifyInstance } from 'fastify'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function fetchWorkspaces(app: FastifyInstance) {
  app.get('/workspaces', { onRequest: [verifyJwt] }, async (request) => {
    const userId = request.user.sub

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          every: {
            userId,
          },
        },
      },
    })

    return {
      workspaces,
    }
  })
}
