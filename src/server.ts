import axios from 'axios'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'

import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { env } from './env'
import { prisma } from './lib/prisma'
import { verifyJwt } from './middlewares/verify-jwt'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Mocha',
      description: 'Sample backend service',
      version: '0.0.1',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.withTypeProvider<ZodTypeProvider>().post(
  '/sessions/github',
  {
    schema: {
      tags: ['Auth'],
      summary: 'Authenticate with github',
      body: z.object({
        code: z.string().min(1),
      }),
    },
  },
  async (request, reply) => {
    const { code } = request.body

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        headers: {
          Accept: 'application/json',
        },
        params: {
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        },
      },
    )

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    })

    if (!userResponse.data.email) {
      return reply.status(400).send({
        message: 'Github error',
      })
    }

    const userFromEmail = await prisma.user.findFirst({
      where: {
        email: userResponse.data.email,
      },
    })

    if (userFromEmail) {
      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '3h',
          },
        },
      )

      return reply.send({ token, user: userFromEmail })
    }

    const user = await prisma.user.create({
      data: {
        name: userResponse.data.name,
        email: userResponse.data.email,
        avatarUrl: userResponse.data.avatar_url,
      },
    })

    const token = await reply.jwtSign(
      {
        sub: user.id,
      },
      {
        sign: {
          expiresIn: '3h',
        },
      },
    )

    return reply.send({ token, user })
  },
)

app.withTypeProvider<ZodTypeProvider>().get(
  '/me',
  {
    schema: {
      tags: ['Auth'],
      summary: 'Get user',
    },
    onRequest: [verifyJwt],
  },
  async (request, reply) => {
    const userId = request.user.sub

    const userFromId = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })

    return reply.send({
      user: userFromId,
    })
  },
)

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => console.log('Server running on port 3333.'))
