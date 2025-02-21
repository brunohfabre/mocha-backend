import { BadRequestError } from '@/http/errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { getUserMembership } from '@/modules/auth'
import type { AuthType, BodyType, Method } from '@prisma/client'

interface UpdateRequestRequest {
  userId: string
  organizationId: string
  requestId: string
  name?: string
  method?: Method
  url?: string
  bodyType?: BodyType
  body?: string
  authType?: AuthType
  auth?: string
  headers?: string[]
  params?: string[]
  parentId?: string | null
}

export async function updateRequest({
  userId,
  organizationId,
  requestId,
  name,
  url,
  method,
  bodyType,
  body,
  authType,
  auth,
  headers,
  params,
  parentId,
}: UpdateRequestRequest) {
  await getUserMembership({
    userId,
    organizationId,
  })

  const requestFromId = await prisma.request.findFirst({
    where: {
      id: requestId,
    },
  })

  if (!requestFromId) {
    throw new BadRequestError()
  }

  const request = await prisma.request.update({
    where: {
      id: requestId,
    },
    data: {
      name,
      url,
      method,
      bodyType,
      body,
      authType,
      auth,
      headers,
      params,
      parentId,
    },
  })

  return { request }
}
