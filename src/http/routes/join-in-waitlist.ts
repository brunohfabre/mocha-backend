import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function joinInWaitlist(app: FastifyInstance) {
  app.post('/waitlist', async (request, reply) => {
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
      await prisma.wait.create({
        data: {
          email,
        },
      })
    }

    return reply.status(204).send()
  })
}
