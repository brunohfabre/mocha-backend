import { FastifyInstance } from 'fastify'
import z from 'zod'

import { mail } from '@/lib/mail'
import { prisma } from '@/lib/prisma'
import { generateCode } from '@/utils/generate-code'

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

    const user = await prisma.user.create({
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

    const code = generateCode()

    await prisma.authLink.create({
      data: {
        userId: user.id,
        code,
      },
    })

    await mail.send({
      from: 'Mocha <no-reply@coddee.com.br>',
      to: [email],
      subject: 'Your temporary login code',
      html: `<div><span style="font-size: 16px;">Your code is: <strong>${code}</strong></span></div>`,
    })

    return reply.status(204).send()
  })
}
