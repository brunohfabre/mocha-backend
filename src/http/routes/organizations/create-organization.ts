import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function createOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Organizations'],
        summary: 'Create organization',
        body: z.object({
          name: z.string().min(1),
        }),
      },
    },
    async (request) => {
      const { name } = request.body

      const organization = await prisma.organization.create({
        data: {
          name,
        },
      })

      return {
        organization,
      }
    },
  )
}
