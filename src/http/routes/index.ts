import type { FastifyInstance } from 'fastify'

import { authenticateWithGithub } from './auth/authenticate-with-github'

export async function routes(app: FastifyInstance) {
  app.register(authenticateWithGithub)
}
