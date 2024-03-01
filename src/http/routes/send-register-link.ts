import { FastifyInstance } from 'fastify'
import z from 'zod'

import { mail } from '@/lib/mail'
import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function sendRegisterLink(app: FastifyInstance) {
  app.post(
    '/send-register-link',
    { onRequest: [verifyJwt] },
    async (request, reply) => {
      const bodySchema = z.object({
        email: z.string().email(),
      })

      const { email } = bodySchema.parse(request.body)

      const waitFromEmail = await prisma.wait.findFirst({
        where: {
          email,
        },
      })

      if (!waitFromEmail) {
        throw new Error('Not on waitlist.')
      }

      const token = await reply.jwtSign(
        {
          sub: email,
        },
        {
          sign: {
            expiresIn: '3h',
          },
        },
      )

      await mail.send({
        from: 'Mocha <no-reply@coddee.com.br>',
        to: [email],
        subject: 'Welcome to your new project management',
        html: `
        <div>
          <p style="font-size: 16px;">Token to register: <strong>${token}</strong></p>
        </div>
      `,
      })

      return reply.status(204).send()
    },
  )
}
