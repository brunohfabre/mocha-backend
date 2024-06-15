import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { createCode } from '@/utils/create-code'

export async function sendAuthenticationCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Send authentication code',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
          },
        })
      }

      const code = createCode()

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          code,
        },
      })

      resend.emails.send({
        from: 'Mocha <no-reply@coddee.com.br>',
        to: [email],
        subject: 'Verification code',
        html: `<p>Your verification is: <strong>${code}</strong></p>`,
      })

      return reply.status(204).send()
    },
  )
}
