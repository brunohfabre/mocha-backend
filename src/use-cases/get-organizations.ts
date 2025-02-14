import { prisma } from '@/lib/prisma'

interface GetOrganizationsRequest {
  userId: string
}

export async function getOrganizations({ userId }: GetOrganizationsRequest) {
  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        every: {
          userId,
        },
      },
    },
  })

  return { organizations }
}
