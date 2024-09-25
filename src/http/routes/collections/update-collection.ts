import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createCollection(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/organizations/:organizationId/collections/:collectionId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        summary: 'Create request',
        params: z.object({
          organizationId: z.string().min(1),
          collectionId: z.string().min(1),
        }),
        body: z.object({
          name: z.string().min(1).default('Untitled'),
        }),
      },
    },
    async (request) => {
      const { organizationId, collectionId } = request.params
      const { name } = request.body

      const collectionFromId = await prisma.collection.findFirst({
        where: {
          id: collectionId
        }
      })

      if(!collectionFromId) {
        throw new BadRequestError('Collection not exists')
      }

      await prisma.collection.update({
        where: {
          id: collectionId
        },
        data: {
          name,
          organizationId
        },
      })
    }
  )
}
