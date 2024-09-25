import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function deleteRequest(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/collections/:collectionId/requests/:requestId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Requests'],
        summary: 'Delete request',
        params: z.object({
          requestId: z.string().min(1),
        }),
     },
    },
    async (request) => {
      const { requestId } = request.params

      const requestsIds = await prisma.$queryRaw<{ id: string }[]>`
        with recursive x as (
          select r.id
            from requests r
          where r.id = ${requestId}
            union
          select r2.id
            from requests r2
          inner join x x1 on r2.parent_id = x1.id
        ) select * from x;
      `

      const ids = requestsIds.map(({ id }) => id)

      await prisma.request.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      })

      return {
        ids
      }
    },
  )
}
