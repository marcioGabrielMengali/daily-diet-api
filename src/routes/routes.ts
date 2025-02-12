import { FastifyInstance } from 'fastify'
import { createUser, getUsers } from './users/user.routes'
import { verifySessionId } from '../middlewares/sessionId.middleware'
import { createMeal } from './meals/meals.routes'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', createUser)

  app.get('/', getUsers)
}

export async function mealsRoutes(app: FastifyInstance){
  app.addHook('preHandler', verifySessionId)
  app.post('/', createMeal)
}
