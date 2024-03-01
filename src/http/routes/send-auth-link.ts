import { FastifyInstance } from 'fastify'
import z from 'zod'

import { mail } from '@/lib/mail'
import { prisma } from '@/lib/prisma'
import { generateCode } from '@/utils/generate-code'

export async function sendAuthLink(app: FastifyInstance) {
  app.post('/authenticate', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
    })

    const { email } = bodySchema.parse(request.body)

    const userFromEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!userFromEmail) {
      throw new Error('User not found.')
    }

    const code = generateCode()

    await prisma.authLink.create({
      data: {
        userId: userFromEmail.id,
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
