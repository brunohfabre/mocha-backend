import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function createCollection(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/collections',
      {
        schema: {
          tags: ['Collections'],
          summary: 'Create a new collection',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          response: {
            201: z.object({
              collectionId: z.string().min(1),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { organization } = await request.getUserMembership(userId)

        const { name } = request.body

        const collection = await prisma.collection.create({
          data: {
            name,
            organizationId: organization.id,
          },
        })

        return reply.status(201).send({
          collectionId: collection.id,
        })
      },
    )
}
