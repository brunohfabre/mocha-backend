import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getDocumentations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:organizationId/documentations',
      {
        schema: {
          tags: ['Documentations'],
          summary: 'Get documentations',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationId: z.string().min(1),
          }),
          response: {
            200: z.object({
              documentations: z.array(
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
        const { organizationId } = request.params
        const { organization } = await request.getUserMembership(organizationId)

        const documentations = await prisma.documentation.findMany({
          where: { organizationId: organization.id },
        })

        if (!documentations) {
          throw new BadRequestError()
        }

        return { documentations }
      },
    )
}
