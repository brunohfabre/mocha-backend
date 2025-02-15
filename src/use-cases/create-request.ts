import { prisma } from '@/lib/prisma'
import { getUserMembership } from '@/modules/auth'

interface CreateRequestRequest {
  userId: string
  organizationId: string
  collectionId: string
}

export async function createRequest({
  userId,
  organizationId,
  collectionId,
}: CreateRequestRequest) {
  await getUserMembership({
    userId,
    organizationId,
  })

  const request = await prisma.request.create({
    data: {
      collectionId,
      name: 'Untitled',
      type: 'REQUEST',
    },
  })

  return { request }
}
