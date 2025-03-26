import { env } from '@/env'
import { fastify } from 'fastify'

const app = fastify()

app.get('/', () => {
  return { ok: true }
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => console.log('Server running on port 3333!'))
