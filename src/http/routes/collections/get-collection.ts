import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { z } from 'zod'

export async function getCollection(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:organizationId/collections/:id',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        summary: 'Get collections',
        params: z.object({
          id: z.string().min(1)
        })
      },
    },
    async (request) => {
     const { id } = request.params

      const collection = await prisma.collection.findFirst({
        where: {
          id
        },
        include: {
          requests: true
        }
      })

      return {
        collection,
      }
    },
  )
}
