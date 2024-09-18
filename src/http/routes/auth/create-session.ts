import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with code',
        body: z.object({
          email: z.string().min(1),
          code: z.string().min(1),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code, email } = request.body

      const userFromEmail = await prisma.user.findFirst({
        where: {
          email
        }
      })

      if (!userFromEmail) {
        throw new BadRequestError('User not exists.')
      }

      if (!userFromEmail.code) {
        throw new BadRequestError('Invalid code')
      }

      if (code !== userFromEmail.code) {
        throw new BadRequestError('Invalid code')
      }

      await prisma.user.update({
        where: {
          id: userFromEmail.id,
        },
        data: {
          code: null,
        },
      })

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.send({ token })
    },
  )
}
