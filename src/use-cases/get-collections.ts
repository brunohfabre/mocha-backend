import { prisma } from '@/lib/prisma'
import { getUserMembership } from '@/modules/auth'

interface GetCollectionsRequest {
  userId: string
  organizationId: string
}

export async function getCollections({
  userId,
  organizationId,
}: GetCollectionsRequest) {
  await getUserMembership({
    userId,
    organizationId,
  })

  const collections = await prisma.collection.findMany({
    where: {
      organizationId,
    },
  })

  return { collections }
}
