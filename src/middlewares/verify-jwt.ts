import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { sub } = await request.jwtVerify<any>()

    request.user = { sub }
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
