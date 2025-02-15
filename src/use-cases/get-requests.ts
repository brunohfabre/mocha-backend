import { prisma } from '@/lib/prisma'
import { getUserMembership } from '@/modules/auth'

interface GetRequestsRequest {
  userId: string
  organizationId: string
  collectionId: string
}

export async function getRequests({
  userId,
  organizationId,
  collectionId,
}: GetRequestsRequest) {
  await getUserMembership({
    userId,
    organizationId,
  })

  const requests = await prisma.request.findMany({
    where: {
      collectionId,
    },
  })

  return { requests }
}
