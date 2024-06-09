import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function updateCollection(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .put(
      '/collections/:id',
      {
        schema: {
          tags: ['Collections'],
          summary: 'Update a collection',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            name: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { organization } = await request.getUserMembership(userId)

        const { id } = request.params
        const { name } = request.body

        const collectionFromId = await prisma.collection.findFirst({
          where: {
            id,
            organizationId: organization.id,
          },
        })

        if (!collectionFromId) {
          throw new BadRequestError()
        }

        await prisma.collection.update({
          where: {
            id,
          },
          data: {
            name,
          },
        })

        return reply.status(204).send()
      },
    )
}
