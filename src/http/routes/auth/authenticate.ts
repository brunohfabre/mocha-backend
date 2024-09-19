import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate',
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        const code = crypto.randomUUID()

        await prisma.user.create({
          data: {
            email,
            code,
          },
        })

        await resend.emails.send({
          from: 'Mocha <no-reply@coddee.co>',
          to: [email],
          subject: 'Verification code',
          html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        })

        return
      }

      const code = crypto.randomUUID()

      await prisma.user.update({
        where: {
          id: userFromEmail.id,
        },
        data: {
          code,
        },
      })

      await resend.emails.send({
        from: 'Mocha <no-reply@coddee.co>',
        to: [email],
        subject: 'Verification code',
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      })

      return reply.status(204).send()
    },
  )
}
