import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function authenticateFromLink(app: FastifyInstance) {
  app.post('/auth-links/authenticate', async (request, reply) => {
    const bodySchema = z.object({
      code: z.string().min(1),
    })

    const { code } = bodySchema.parse(request.body)

    const authLinkFromCode = await prisma.authLink.findFirst({
      where: {
        code,
      },
    })

    if (!authLinkFromCode) {
      throw new Error('Auth link not found.')
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error('Auth link expired, please generate a new one.')
    }

    const userFromId = await prisma.user.findFirst({
      where: {
        id: authLinkFromCode.userId,
      },
    })

    if (!userFromId) {
      throw new Error('User not found.')
    }

    const token = await reply.jwtSign(
      {
        sub: userFromId.id,
      },
      {
        sign: {
          expiresIn: '7d',
        },
      },
    )

    return reply.send({
      user: userFromId,
      token,
    })
  })
}
