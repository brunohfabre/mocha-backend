import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getCollections(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/collections',
      {
        schema: {
          tags: ['Collections'],
          summary: 'Get collections',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              collections: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  organizationId: z.string(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { organization } = await request.getUserMembership(userId)

        const collections = await prisma.collection.findMany({
          where: { organizationId: organization.id },
        })

        if (!collections) {
          throw new BadRequestError()
        }

        return { collections }
      },
    )
}
