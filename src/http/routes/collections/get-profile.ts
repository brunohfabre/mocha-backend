import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getCollections } from '@/use-cases/get-collections'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getCollectionsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:organizationId/collections',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Collections'],
        operationId: 'getCollections',
        summary: 'Get collections',
        params: z.object({
          organizationId: z.string(),
        }),
        response: {
          200: z.object({
            collections: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { organizationId } = request.params

      const { collections } = await getCollections({ organizationId })

      return reply.send({
        collections,
      })
    }
  )
}
