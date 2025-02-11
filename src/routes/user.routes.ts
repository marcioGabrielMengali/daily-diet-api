import { FastifyInstance } from 'fastify'
import { createUserSchema } from '../schemas/users.schema'
import { ZodError } from 'zod'
import { formatError } from '../utils/formatError'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const result = createUserSchema.safeParse(request.body)

    if (!result.success) {
      const fromattedErrors = formatError(result.error)
      console.error(
        `${usersRoutes.name} :: createUserSchame :: error :: ${result.error}`
      )
      return response
        .status(400)
        .send(JSON.stringify({ errors: fromattedErrors }))
    }

    const { name } = result.data
    try {
      await knex('users').insert({
        id: randomUUID(),
        name,
      })
      return response.status(201).send()
    } catch (error) {
      console.error(
        `${usersRoutes.name} :: error on insert on database :: error :: ${error}`
      )
      return response.status(500).send('Internal Server Error')
    }
  })

  app.get('/', async (_, response) => {
    try {
      const users = await knex('users').select('*')
      return { users }
    } catch (error) {
      console.error(
        `${usersRoutes.name} :: error on insert on database :: error :: ${error}`
      )
      return response.status(500).send('Internal Server Error')
    }
  })
}
