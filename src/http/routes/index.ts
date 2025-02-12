import type { FastifyInstance } from 'fastify'
import { authenticateFromGithubRoute } from './auth/authenticate-from-github'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticateFromGithubRoute)
}
