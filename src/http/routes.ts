import { prisma } from '@/lib/prisma'
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

      await prisma.user.create({
        data: {
          name,
          email,
        },
      })

      // TODO: send code email

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

      // TODO: send code email

      return reply.status(204).send()
    }
  )
}

export async function routes(app: FastifyInstance) {
  app.register(registerRoute)
  app.register(authenticateWithEmailRoute)
}
