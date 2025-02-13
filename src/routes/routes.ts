import { FastifyInstance } from 'fastify'
import { createUser, getUsers } from './users/user.routes'
import { verifySessionId } from '../middlewares/sessionId.middleware'
import {
  createMeal,
  deleteMeal,
  getMeal,
  listMeals,
  mealMetrics,
  updateMeal,
} from './meals/meals.routes'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', createUser)

  app.get('/', getUsers)
}

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifySessionId)
  app.post('/', createMeal)
  app.get('/', listMeals)
  app.get('/:id', getMeal)
  app.put('/:id', updateMeal)
  app.delete('/:id', deleteMeal)
  app.get('/metrics', mealMetrics)
}
