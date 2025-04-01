import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

const registerRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Register user',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { name, email } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userFromEmail) {
        throw new Error('User already exists.')
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      })

      const token = await prisma.token.create({
        data: {
          type: 'AUTH',
          userId: user.id,
        },
      })

      const { error } = await resend.emails.send({
        from: 'Mocha <no-reply@coddee.co>',
        to: [email],
        subject: 'Auth token',
        html: `<strong>Code: ${token.id}</strong>`,
      })

      if (error) {
        return console.error({ error })
      }

      return reply.status(204).send()
    }
  )
}

const authenticateWithEmailRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/email',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with email',
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        throw new Error('Account not found.')
      }

      const token = await prisma.token.create({
        data: {
          type: 'AUTH',
          userId: userFromEmail.id,
        },
      })

      const { error } = await resend.emails.send({
        from: 'Mocha <no-reply@coddee.co>',
        to: [email],
        subject: 'Auth token',
        html: `<strong>Code: ${token.id}</strong>`,
      })

      if (error) {
        return console.error({ error })
      }

      return reply.status(204).send()
    }
  )
}

export async function routes(app: FastifyInstance) {
  app.register(registerRoute)
  app.register(authenticateWithEmailRoute)
}
