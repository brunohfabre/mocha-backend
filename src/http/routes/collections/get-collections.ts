import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { z } from 'zod'

export async function getCollections(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:organizationId/collections',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        summary: 'Get collections',
        params: z.object({
          organizationId: z.string().min(1)
        })
      },
    },
    async (request) => {
     const { organizationId } = request.params

      const collections = await prisma.collection.findMany({
        where: {
          organizationId
        }
      })

      return {
        collections,
      }
    },
  )
}
