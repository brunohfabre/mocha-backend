import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getUser } from '@/use-cases/getUser'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getProfileRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['User'],
        operationId: 'getProfile',
        summary: 'Get authenticated user profile',
        response: {
          200: z.object({
            token: z.string(),
            user: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string(),
              avatarUrl: z.string().url().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const { token, user } = await getUser({ userId })

      return reply.send({
        token,
        user,
      })
    }
  )
}
