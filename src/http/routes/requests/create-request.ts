import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { createRequest } from '@/use-cases/create-request'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function createRequestRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:organizationId/collections/:collectionId/requests',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        operationId: 'createRequest',
        summary: 'Create request',
        params: z.object({
          organizationId: z.string(),
          collectionId: z.string(),
        }),
        response: {
          200: z.object({
            request: z.object({
              id: z.string(),
              name: z.string(),
              type: z.string(),
              method: z.string().nullable(),
              url: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { organizationId, collectionId } = request.params

      const { request: requestCreated } = await createRequest({
        userId,
        organizationId,
        collectionId,
      })

      return reply.send({
        request: requestCreated,
      })
    }
  )
}
