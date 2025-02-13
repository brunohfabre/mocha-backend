import { BadRequestError } from '@/http/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

interface GetCollectionsRequest {
  organizationId: string
}

export async function getCollections({
  organizationId,
}: GetCollectionsRequest) {
  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
    },
  })

  if (!organization) {
    throw new BadRequestError()
  }

  const collections = await prisma.collection.findMany({
    where: {
      organizationId,
    },
  })

  return { collections }
}
