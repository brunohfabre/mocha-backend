import type { FastifyInstance } from 'fastify'

import { authenticate } from './auth/authenticate'
import { createSession } from './auth/create-session'
import { getProfile } from './auth/get-profile'
import { createOrganization } from './organizations/create-organization'
import { getOrganizations } from './organizations/get-organizations'
import { updateUser } from './users/update-user'

export async function routes(app: FastifyInstance) {
  app.register(authenticate)
  app.register(createSession)
  app.register(getProfile)

  app.register(updateUser)

  app.register(getOrganizations)
  app.register(createOrganization)
}
