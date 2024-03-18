import { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { verifyJwt } from '../middlewares/verify-jwt'

export async function updateUser(app: FastifyInstance) {
  app.put('/users', { onRequest: [verifyJwt] }, async (request) => {
    const bodySchema = z.object({
      name: z.string().min(1),
    })

    const { name } = bodySchema.parse(request.body)

    const userId = request.user.sub

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
    })

    return {
      user,
    }
  })
}
