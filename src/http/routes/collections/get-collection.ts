import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getCollection(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/collections/:id',
      {
        schema: {
          tags: ['Collections'],
          summary: 'Get details from collection',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              collection: z.object({
                id: z.string(),
                name: z.string(),
                organizationId: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { id } = request.params

        const userId = await request.getCurrentUserId()
        const { organization } = await request.getUserMembership(userId)

        const collectionFromId = await prisma.collection.findFirst({
          where: { id, organizationId: organization.id },
        })

        if (!collectionFromId) {
          throw new BadRequestError()
        }

        return { collection: collectionFromId }
      },
    )
}
