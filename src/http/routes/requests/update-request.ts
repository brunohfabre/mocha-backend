import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { updateRequest } from '@/use-cases/update-request'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function updateRequestRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:organizationId/collections/:collectionId/requests/:requestId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        operationId: 'updateRequest',
        summary: 'Update request',
        params: z.object({
          organizationId: z.string(),
          collectionId: z.string(),
          requestId: z.string(),
        }),
        body: z.object({
          name: z.string().optional(),
          method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
          url: z.string().optional(),
          bodyType: z.enum(['NONE', 'JSON']).optional(),
          body: z.string().optional(),
          authType: z.enum(['NONE', 'BEARER']).optional(),
          auth: z.string().optional(),
          headers: z.array(z.string()).optional(),
          params: z.array(z.string()).optional(),
          parentId: z.string().optional(),
        }),
        response: {
          200: z.object({
            request: z.object({
              id: z.string(),
              name: z.string(),
              type: z.string(),
              method: z
                .enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
                .nullable(),
              url: z.string().nullable(),
              bodyType: z.enum(['NONE', 'JSON']),
              body: z.string().nullable(),
              authType: z.enum(['NONE', 'BEARER']),
              auth: z.string().nullable(),
              headers: z.array(z.string()),
              params: z.array(z.string()),
              parentId: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { organizationId, requestId } = request.params
      const {
        name,
        method,
        url,
        bodyType,
        body,
        authType,
        auth,
        headers,
        params,
        parentId,
      } = request.body

      const { request: requestUpdated } = await updateRequest({
        userId,
        organizationId,
        requestId,
        name,
        method,
        url,
        bodyType,
        body,
        authType,
        auth,
        headers,
        params,
        parentId,
      })

      return reply.send({
        request: requestUpdated,
      })
    }
  )
}
