import { prisma } from '@/lib/prisma'
import { getUserMembership } from '@/modules/auth'

interface GetCollectionRequest {
  userId: string
  organizationId: string
  collectionId: string
}

export async function getCollection({
  userId,
  organizationId,
  collectionId,
}: GetCollectionRequest) {
  await getUserMembership({
    userId,
    organizationId,
  })

  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
    },
  })

  return { collection }
}
