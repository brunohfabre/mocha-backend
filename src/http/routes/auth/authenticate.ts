import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAccessTokenFromCode, getUserFromAccessToken } from '@/modules/github'
import { prisma } from '@/lib/prisma'

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate',
        body: z.object({
          code: z.string()
        }),
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const accessToken = await getAccessTokenFromCode(code)
      const githubUser = await getUserFromAccessToken(accessToken)

      let userFromEmail = await prisma.user.findFirst({
        where: {
          email: githubUser.email
        }
      })

      if (!userFromEmail) {
        userFromEmail = await prisma.user.create({
          data: {
            name: githubUser.name,
            email: githubUser.email,
            avatarUrl: githubUser.avatar_url,
            githubId: githubUser.id
          }
        })
      }

      if (!userFromEmail.githubId) {
        userFromEmail = await prisma.user.update({
          where: {
            id: userFromEmail.id,
          },
          data: {
            name: githubUser.name,
            avatarUrl: githubUser.avatar_url,
            githubId: githubUser.id
          }
        })
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.send({ token, user: userFromEmail })
    },
  )
}
