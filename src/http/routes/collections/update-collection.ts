import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequestError } from '../_errors/bad-request-error'

export async function updateCollection(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/organizations/:organizationId/collections/:id',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        summary: 'Update collection',
        params: z.object({
          organizationId: z.string().min(1),
          id: z.string().min(1),
        }),
        body: z.object({
          name: z.string().min(1).optional(),
          environments: z.string().optional()
        }),
      },
    },
    async (request) => {
      const { id } = request.params
      const { name, environments } = request.body

      const collectionFromId = await prisma.collection.findFirst({
        where: {
          id
        }
      })

      if (!collectionFromId) {
        throw new BadRequestError('Collection not exists')
      }

      await prisma.collection.update({
        where: {
          id
        },
        data: {
          name,
          environments,
        },
      })
    }
  )
}
