import { BadRequestError } from '@/http/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

interface GetUserRequest {
  userId: string
}

export async function getUser({ userId }: GetUserRequest) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new BadRequestError()
  }

  return { user }
}
