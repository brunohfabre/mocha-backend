import { FastifyInstance } from 'fastify'

import { authenticateFromLink } from './authenticate-from-link'
import { createWorkspace } from './create-workspace'
import { fetchWorkspaces } from './fetch-workspaces'
import { joinInWaitlist } from './join-in-waitlist'
import { me } from './me'
import { register } from './register'
import { sendAuthLink } from './send-auth-link'
import { sendRegisterLink } from './send-register-link'
import { updateUser } from './update-user'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticateFromLink)
  app.register(register)
  app.register(sendAuthLink)
  app.register(joinInWaitlist)
  app.register(sendRegisterLink)
  app.register(me)
  app.register(updateUser)

  app.register(fetchWorkspaces)
  app.register(createWorkspace)
}
