import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create account',
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

        // send email with code

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

      // send email with code

      return reply.status(204).send()
    },
  )
}
