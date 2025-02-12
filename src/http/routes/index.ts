import type { FastifyInstance } from 'fastify'
import { authenticateFromGithubRoute } from './auth/authenticate-from-github'
import { getProfileRoute } from './users/get-profile'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticateFromGithubRoute)

  app.register(getProfileRoute)
}
