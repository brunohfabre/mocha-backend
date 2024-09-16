import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

import { BadRequestError } from '../_errors/bad-request-error'

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/users/:id',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Users'],
        summary: 'Update user',
        body: z.object({
          name: z.string().min(1),
        }),
        params: z.object({
          id: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { name } = request.body

      const userFromId = await prisma.user.findFirst({
        where: {
          id,
        },
      })

      if (!userFromId) {
        throw new BadRequestError('User not found')
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
        },
      })

      return reply.status(204).send()
    },
  )
}
