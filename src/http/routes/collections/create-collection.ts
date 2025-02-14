import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { createCollection } from '@/use-cases/create-collection'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function createCollectionRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:organizationId/collections',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        operationId: 'createCollection',
        summary: 'Create collection',
        params: z.object({
          organizationId: z.string(),
        }),
        body: z.object({
          name: z.string(),
        }),
        response: {
          200: z.object({
            collection: z.object({
              id: z.string(),
              name: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { organizationId } = request.params
      const { name } = request.body

      const { collection } = await createCollection({
        userId,
        organizationId,
        name,
      })

      return reply.send({
        collection,
      })
    }
  )
}
