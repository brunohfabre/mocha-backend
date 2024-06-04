import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:id/membership',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get user membership on organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                role: z.enum(['ADMIN', 'MEMBER']),
                organizationId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { id } = request.params

        const { membership } = await request.getUserMembership(id)

        return {
          membership: {
            id: membership.id,
            role: membership.role,
            organizationId: membership.organizationId,
          },
        }
      },
    )
}
