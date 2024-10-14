import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function deleteCollection(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/organizations/:organizationId/collections/:id',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        summary: 'Delete collection',
        params: z.object({
          organizationId: z.string().min(1),
          id: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const collection = await prisma.collection.delete({
        where: {
          id: id
        }
      })

      return reply.status(204).send()
    },
  )
}
