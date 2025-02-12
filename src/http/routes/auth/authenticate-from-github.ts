import { authenticateFromGithubCode } from '@/use-cases/authenticate-from-github-code'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function authenticateFromGithubRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/github',
    {
      schema: {
        tags: ['Auth'],
        operationId: 'authenticateFromGithub',
        summary: 'Authenticate from GitHub code',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({ token: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const { token } = await authenticateFromGithubCode({
        code,
      })

      return reply.status(201).send({ token })
    }
  )
}
