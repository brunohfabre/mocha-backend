import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/middlewares/verify-jwt'

import { BadRequestError } from '../_errors/bad-request-error'
import slugify from 'slugify'

export async function createUserName(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/users/:id/name',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Users'],
        summary: 'Create user name',
        body: z.object({
          name: z.string().min(1),
        }),
        params: z.object({
          id: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { name } = request.body

      const userFromId = await prisma.user.findFirst({
        where: {
          id,
        },
      })

      if (!userFromId) {
        throw new BadRequestError('User not found')
      }

      const orgName = `${name}'s`
      const slug = slugify(orgName, {
        lower: true,
        strict: true
      })

      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          organizations: {
            create: {
              name: `${name}'s`,
              slug,
              personal: true,
              members: {
                create: {
                  role: 'ADMIN',
                  userId: userFromId.id
                }
              }
            }
          }
        },
        include: {
          organizations: true
        }
      })

      return {
        user: updatedUser
      }
    },
  )
}
