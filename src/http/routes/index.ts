import type { FastifyInstance } from 'fastify'

import { authenticateWithGithub } from './auth/authenticate-with-github'
import { getProfile } from './auth/get-profile'
import { createOrganization } from './organizations/create-organization'
import { getOrganizations } from './organizations/get-organizations'

export async function routes(app: FastifyInstance) {
  app.register(authenticateWithGithub)
  app.register(getProfile)

  app.register(getOrganizations)
  app.register(createOrganization)
}
