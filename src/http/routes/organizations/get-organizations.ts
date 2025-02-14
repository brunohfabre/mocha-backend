import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getOrganizations } from '@/use-cases/get-organizations'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getOrganizationsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Organizations'],
        operationId: 'getOrganizations',
        summary: 'Get organizations',
        response: {
          200: z.object({
            organizations: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const { organizations } = await getOrganizations({ userId })

      return reply.send({
        organizations,
      })
    }
  )
}
