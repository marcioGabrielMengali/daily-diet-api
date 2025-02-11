import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/routes'

const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(cookie)
app.register(usersRoutes, { prefix: '/users' })
export default app
