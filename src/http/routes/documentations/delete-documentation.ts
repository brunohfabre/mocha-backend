import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function deleteDocumentation(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      '/organizations/:organizationId/documentations/:id',
      {
        schema: {
          tags: ['Documentations'],
          summary: 'Delete a documentation',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
            organizationId: z.string().min(1),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { organization } = await request.getUserMembership(userId)

        const { id } = request.params

        const documentationFromId = await prisma.documentation.findFirst({
          where: {
            id,
            organizationId: organization.id,
          },
        })

        if (!documentationFromId) {
          throw new BadRequestError()
        }

        await prisma.documentation.delete({
          where: {
            id,
          },
        })

        return reply.status(204).send()
      },
    )
}
