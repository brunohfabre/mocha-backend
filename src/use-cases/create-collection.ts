import { prisma } from '@/lib/prisma'
import { getUserMembership } from '@/modules/auth'

interface CreateCollectionRequest {
  userId: string
  organizationId: string
  name: string
}

export async function createCollection({
  userId,
  organizationId,
  name,
}: CreateCollectionRequest) {
  await getUserMembership({
    userId,
    organizationId,
  })

  const collection = await prisma.collection.create({
    data: {
      name,
      organizationId,
      environments: {},
    },
  })

  return { collection }
}
