import { BadRequestError } from '@/http/errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/modules/auth'

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

  const { token } = await authenticateUser({
    userId,
  })

  return { token, user }
}
