import fastify from 'fastify'
import { usersRoutes } from './routes/user.routes'

const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`)
})
app.register(usersRoutes, { prefix: '/users' })
export default app
