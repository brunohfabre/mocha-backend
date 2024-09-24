import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function deleteCollection(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/organizations/:organizationId/collections/:collectionId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        summary: 'Delete request',
        params: z.object({
          organizationId: z.string().min(1),
          collectionId: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { organizationId, collectionId } = request.params

      const collection = await prisma.collection.delete({
        where: {
          id: collectionId
        }
      })

      return reply.status(204).send()
    },
  )
}
