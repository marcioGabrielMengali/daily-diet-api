import { FastifyInstance } from 'fastify'
import { createUser, getUsers } from './users/user.routes'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', createUser)

  app.get('/', getUsers)
}
