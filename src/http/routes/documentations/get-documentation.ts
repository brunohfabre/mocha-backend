import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getDocumentation(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:organizationId/documentations/:id',
      {
        schema: {
          tags: ['Documentations'],
          summary: 'Get details from documentation',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
            organizationId: z.string().min(1),
          }),
          response: {
            200: z.object({
              documentation: z.object({
                id: z.string(),
                name: z.string(),
                fileUrl: z.string().url(),
                organizationId: z.string(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { id, organizationId } = request.params

        const { organization } = await request.getUserMembership(organizationId)

        const documentationFromId = await prisma.documentation.findFirst({
          where: { id, organizationId: organization.id },
        })

        if (!documentationFromId) {
          throw new BadRequestError()
        }

        return { documentation: documentationFromId }
      },
    )
}
