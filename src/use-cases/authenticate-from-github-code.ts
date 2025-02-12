import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/modules/auth'
import {
  getAccessTokenFromCode,
  getUserFromAccessToken,
} from '@/modules/github'

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
    user = await prisma.user.create({
      data: {
        githubId: githubUser.id,
        name: githubUser.name,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
      },
    })
  }

  const { token } = await authenticateUser({ userId: user.id })

  return { token }
}
