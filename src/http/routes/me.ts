import { FastifyInstance } from 'fastify'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function me(app: FastifyInstance) {
  app.get('/me', { onRequest: [verifyJwt] }, async (request, reply) => {
    const userId = request.user.sub

    const userFromId = await prisma.user.findFirst({
      where: {
        id: userId,
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
