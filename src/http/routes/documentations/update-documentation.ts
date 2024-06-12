import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function updateDocumentation(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .put(
      '/organizations/:organizationId/documentations/:id',
      {
        schema: {
          tags: ['Documentations'],
          summary: 'Update a documentation',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
            organizationId: z.string().min(1),
          }),
          body: z.object({
            name: z.string(),
            fileUrl: z.string().url(),
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
        const { name, fileUrl } = request.body

        const documentationFromId = await prisma.documentation.findFirst({
          where: {
            id,
            organizationId: organization.id,
          },
        })

        if (!documentationFromId) {
          throw new BadRequestError()
        }

        await prisma.documentation.update({
          where: {
            id,
          },
          data: {
            name,
            fileUrl,
          },
        })

        return reply.status(204).send()
      },
    )
}
