import type { FastifyInstance } from 'fastify'

import { authenticateWithGithub } from './auth/authenticate-with-github'
import { getProfile } from './auth/get-profile'
import { createCollection } from './collections/create-collection'
import { deleteCollection } from './collections/delete-collection'
import { getCollection } from './collections/get-collection'
import { getCollections } from './collections/get-collections'
import { updateCollection } from './collections/update-collection'
import { createDocumentation } from './documentations/create-documentation'
import { deleteDocumentation } from './documentations/delete-documentation'
import { getDocumentation } from './documentations/get-documentation'
import { getDocumentations } from './documentations/get-documentations'
import { updateDocumentation } from './documentations/update-documentation'
import { createOrganization } from './organizations/create-organization'
import { deleteOrganization } from './organizations/delete-organization'
import { getMembership } from './organizations/get-membership'
import { getOrganization } from './organizations/get-organization'
import { getOrganizations } from './organizations/get-organizations'
import { updateOrganization } from './organizations/update-organization'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticateWithGithub)
  app.register(getProfile)

  app.register(createOrganization)
  app.register(getMembership)
  app.register(getOrganizations)
  app.register(getOrganization)
  app.register(updateOrganization)
  app.register(deleteOrganization)

  app.register(createCollection)
  app.register(getCollection)
  app.register(getCollections)
  app.register(updateCollection)
  app.register(deleteCollection)

  app.register(createDocumentation)
  app.register(getDocumentation)
  app.register(getDocumentations)
  app.register(updateDocumentation)
  app.register(deleteDocumentation)
}
