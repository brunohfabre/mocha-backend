import type { FastifyInstance } from 'fastify'
import { authenticateFromGithubRoute } from './auth/authenticate-from-github'
import { getCollectionsRoute } from './collections/get-profile'
import { getProfileRoute } from './users/get-profile'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticateFromGithubRoute)

  app.register(getProfileRoute)

  app.register(getCollectionsRoute)
}
