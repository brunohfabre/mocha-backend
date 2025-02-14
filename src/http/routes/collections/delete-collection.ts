import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { deleteCollection } from '@/use-cases/delete-collection'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function deleteCollectionRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/organizations/:organizationId/collections/:collectionId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        operationId: 'deleteCollection',
        summary: 'Delete collection',
        params: z.object({
          organizationId: z.string(),
          collectionId: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { organizationId, collectionId } = request.params

      await deleteCollection({
        userId,
        organizationId,
        collectionId,
      })

      return reply.status(201).send()
    }
  )
}
