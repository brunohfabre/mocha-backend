import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateFromCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with password',
        body: z.object({
          code: z.string(),
          email: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
            user: z.object({
              id: z.string().min(1),
              name: z.string().nullable(),
              email: z.string().min(1).email(),
              avatarUrl: z.string().nullable(),
            }),
            needFinishSetup: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code, email } = request.body

      const user = await prisma.user.findFirst({
        where: { email, code },
      })

      if (!user) {
        throw new BadRequestError('This code is invalid.')
      }

      const userMembershipsCount = await prisma.member.count({
        where: {
          userId: user.id,
        },
      })

      const needFinishSetup = userMembershipsCount === 0

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token, user, needFinishSetup })
    },
  )
}
