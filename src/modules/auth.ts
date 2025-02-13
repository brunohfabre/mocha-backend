import { env } from '@/env'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { SignJWT } from 'jose'

export async function authenticateUser({ userId }: { userId: string }) {
  const secret = new TextEncoder().encode(env.JWT_SECRET)

  const token = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setSubject(userId)
    .setExpirationTime('1d')
    .sign(secret)

  return { token }
}

export async function getUserMembership({
  userId,
  organizationId,
}: { userId: string; organizationId: string }) {
  const member = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
    include: {
      organization: true,
    },
  })

  if (!member) {
    throw new UnauthorizedError(`You're not a member of this organization.`)
  }

  const { organization, ...membership } = member

  return {
    organization,
    membership,
  }
}
