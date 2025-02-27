import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/modules/auth'
import {
  getAccessTokenFromCode,
  getUserFromAccessToken,
} from '@/modules/github'
import slugify from 'slugify'

interface AuthenticateFromGithubCodeRequest {
  code: string
}

export async function authenticateFromGithubCode({
  code,
}: AuthenticateFromGithubCodeRequest) {
  const accessToken = await getAccessTokenFromCode(code)
  const githubUser = await getUserFromAccessToken(accessToken)

  let user = await prisma.user.findFirst({
    where: {
      githubId: githubUser.id,
    },
  })

  if (!user) {
    user = await prisma.$transaction(async (tx) => {
      const userCreated = await tx.user.create({
        data: {
          githubId: githubUser.id,
          name: githubUser.name,
          email: githubUser.email,
          avatarUrl: githubUser.avatar_url,
        },
      })

      await tx.organization.create({
        data: {
          name: `${githubUser.name}'s`,
          slug: slugify(`${githubUser.name}'s`, {
            lower: true,
            trim: true,
            strict: true,
          }),
          personal: true,
          ownerId: userCreated.id,
          members: {
            create: {
              role: 'ADMIN',
              userId: userCreated.id,
            },
          },
        },
      })

      return userCreated
    })
  }

  const { token } = await authenticateUser({ userId: user.id })

  return { token }
}
