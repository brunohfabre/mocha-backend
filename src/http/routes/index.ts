import type { FastifyInstance } from 'fastify'

import { authenticate } from './auth/authenticate'
import { createSession } from './auth/create-session'
import { getProfile } from './auth/get-profile'
import { updateUser } from './users/update-user'
import { createUserName } from './users/create-user-name'
import { createRequest } from './requests/create-request'
import { getOrganizations } from './organizations/get-organizations'
import { getCollections } from './collections/get-collections'

export async function routes(app: FastifyInstance) {
  app.register(authenticate)
  app.register(createSession)
  app.register(getProfile)

  app.register(updateUser)

  app.register(createUserName)

  app.register(getOrganizations)

  app.register(getCollections)

  app.register(createRequest)
}
