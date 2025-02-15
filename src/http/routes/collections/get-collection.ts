import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getCollection } from '@/use-cases/get-collection'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getCollectionRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:organizationId/collections/:collectionId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        operationId: 'getCollection',
        summary: 'Get collection',
        params: z.object({
          organizationId: z.string(),
          collectionId: z.string(),
        }),
        response: {
          200: z.object({
            collection: z
              .object({
                id: z.string(),
                name: z.string(),
              })
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { organizationId, collectionId } = request.params

      const { collection } = await getCollection({
        userId,
        organizationId,
        collectionId,
      })

      return reply.send({
        collection,
      })
    }
  )
}
