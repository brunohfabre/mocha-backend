import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function register(app: FastifyInstance) {
  app.post('/register', { onRequest: [verifyJwt] }, async (request, reply) => {
    const bodySchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    })

    const { name, email } = bodySchema.parse(request.body)

    const userFromEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userFromEmail) {
      throw new Error('User already exists.')
    }

    const waitFromEmail = await prisma.wait.findFirst({
      where: {
        email,
      },
    })

    if (!waitFromEmail) {
      throw new Error('Not on waitlist.')
    }

    await prisma.user.create({
      data: {
        name,
        email,
        memberIn: {
          create: {
            role: 'OWNER',
            workspace: {
              create: {
                name: 'private',
              },
            },
          },
        },
      },
    })

    return reply.status(204).send()
  })
}
