import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getRequests } from '@/use-cases/get-requests'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getRequestsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:organizationId/collections/:collectionId/requests',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        operationId: 'getRequests',
        summary: 'Get requests',
        params: z.object({
          organizationId: z.string(),
          collectionId: z.string(),
        }),
        response: {
          200: z.object({
            requests: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                type: z.string(),
                method: z.string().nullable(),
                url: z.string().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { organizationId, collectionId } = request.params

      const { requests } = await getRequests({
        userId,
        organizationId,
        collectionId,
      })

      return reply.send({
        requests,
      })
    }
  )
}
