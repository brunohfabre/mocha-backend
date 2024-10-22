import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function createCollection(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:organizationId/collections',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        summary: 'Create collection',
        params: z.object({
          organizationId: z.string().min(1),
        }),
        body: z.object({
          name: z.string().min(1).default('Untitled'),
        }),
      },
    },
    async (request) => {
      const { organizationId } = request.params
      const { name } = request.body

      const collection = await prisma.collection.create({
        data: {
          name,
          organizationId,
          environments: {
            environments: [],
            variables: []
          }
        },
      })

      return {
        collection,
      }
    },
  )
}
