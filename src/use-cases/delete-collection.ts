import { prisma } from '@/lib/prisma'
import { getUserMembership } from '@/modules/auth'

interface DeleteCollectionRequest {
  userId: string
  organizationId: string
  collectionId: string
}

export async function deleteCollection({
  userId,
  organizationId,
  collectionId,
}: DeleteCollectionRequest) {
  await getUserMembership({
    userId,
    organizationId,
  })

  await prisma.collection.delete({
    where: {
      id: collectionId,
    },
  })
}
