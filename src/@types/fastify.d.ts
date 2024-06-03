import 'fastify'

import type { Member, Organization } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(
      id: string,
    ): Promise<{ organization: Organization; membership: Member }>
  }
}
