import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function updateRequest(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/collections/:collectionId/requests/:id',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        summary: 'Create request',
        params: z.object({
          id: z.string().min(1),
        }),
        body: z.object({
          name: z.string().optional(),
          method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
          url: z.string().optional(),
          bodyType: z.enum(['NONE', 'JSON']).optional(),
          body: z.any().optional(),
          authType: z.enum(['NONE', 'BEARER']).optional(),
          auth: z.any().optional(),
          headers: z.array(z.object({
            name: z.string(),
            value: z.string(),
          })).optional(),
          params: z.array(z.object({
            name: z.string(),
            value: z.string(),
          })).optional()
        }),
      },
    },
    async (request) => {
      const { id } = request.params
      const { name, method, url, bodyType, body, authType, auth, headers, params } = request.body

      const requestCreated = await prisma.request.update({
        where: {
          id
        },
        data: {
          name,
          method,
          url,
          bodyType,
          body,
          authType,
          auth,
          headers,
          params
        },
      })

      return {
        request: requestCreated,
      }
    },
  )
}
