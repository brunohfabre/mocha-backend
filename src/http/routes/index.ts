import { FastifyInstance } from 'fastify'

import { authenticateFromLink } from './authenticate-from-link'
import { createOrganization } from './create-organization'
import { deleteOrganization } from './delete-organization'
import { fetchOrganizations } from './fetch-organizations'
import { getOrganization } from './get-organization'
import { joinInWaitlist } from './join-in-waitlist'
import { me } from './me'
import { register } from './register'
import { sendAuthLink } from './send-auth-link'
import { sendRegisterLink } from './send-register-link'
import { updateOrganization } from './update-organization'
import { updateUser } from './update-user'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticateFromLink)
  app.register(register)
  app.register(sendAuthLink)
  app.register(joinInWaitlist)
  app.register(sendRegisterLink)
  app.register(me)
  app.register(updateUser)

  app.register(fetchOrganizations)
  app.register(getOrganization)
  app.register(createOrganization)
  app.register(updateOrganization)
  app.register(deleteOrganization)
}
