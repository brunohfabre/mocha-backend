import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function createDocumentation(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/organizations/:organizationId/documentations',
      {
        schema: {
          tags: ['Documentations'],
          summary: 'Create a new documentation',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationId: z.string().min(1),
          }),
          body: z.object({
            name: z.string(),
            fileUrl: z.string().url(),
          }),
          response: {
            201: z.object({
              documentationId: z.string().min(1),
            }),
          },
        },
      },
      async (request, reply) => {
        const { organizationId } = request.params

        const { organization } = await request.getUserMembership(organizationId)

        const { name, fileUrl } = request.body

        const documentation = await prisma.documentation.create({
          data: {
            name,
            fileUrl,
            organizationId: organization.id,
          },
        })

        return reply.status(201).send({
          documentationId: documentation.id,
        })
      },
    )
}
