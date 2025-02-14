import type { FastifyInstance } from 'fastify'
import { authenticateFromGithubRoute } from './auth/authenticate-from-github'
import { createCollectionRoute } from './collections/create-collection'
import { deleteCollectionRoute } from './collections/delete-collection'
import { getCollectionsRoute } from './collections/get-collections'
import { getOrganizationsRoute } from './organizations/get-organizations'
import { getProfileRoute } from './users/get-profile'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticateFromGithubRoute)

  app.register(getProfileRoute)

  app.register(getOrganizationsRoute)

  app.register(getCollectionsRoute)
  app.register(createCollectionRoute)
  app.register(deleteCollectionRoute)
}
