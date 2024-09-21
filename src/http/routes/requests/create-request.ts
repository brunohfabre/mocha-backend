import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function createRequest(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/collections/:collectionId/requests',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        summary: 'Create request',
        params: z.object({
          collectionId: z.string().min(1),
        }),
        body: z.object({
          name: z.string().min(1).default('Untitled'),
          type: z.enum(['REQUEST', 'FOLDER'])
        }),
      },
    },
    async (request) => {
      const { collectionId } = request.params
      const { name, type } = request.body

      const requestCreated = await prisma.request.create({
        data: {
          name,
          type,
          collectionId
        },
      })

      return {
        request: requestCreated,
      }
    },
  )
}
