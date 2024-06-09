import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function getOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:id',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get details from organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              organization: z.object({
                id: z.string(),
                name: z.string(),
                domain: z.string().nullable(),
                shouldAttachUsersByDomain: z.boolean(),
                createdAt: z.date(),
                updatedAt: z.date(),
                ownerId: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { id } = request.params

        const { organization } = await request.getUserMembership(id)

        return { organization }
      },
    )
}
