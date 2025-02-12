import { FastifyReply, FastifyRequest } from 'fastify'
import { createMealSchema } from '../../validation/meal.schema'
import { formatError } from '../../utils/formatError'
import { knex } from '../../database'
import { randomUUID } from 'crypto'

export const createMeal = async (req: FastifyRequest, res: FastifyReply) => {
  const parsedBody = createMealSchema.safeParse(req.body)
  if (!parsedBody.success) {
    const fromattedErrors = formatError(parsedBody.error)
    console.error(
      `${createMeal.name} :: createUserSchame :: error :: ${parsedBody.error}`
    )
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }))
  }
  const meal = parsedBody.data
  try {
    await knex('meals').insert({
      id: randomUUID(),
      user_id: req.user.id,
      name: meal.name,
      desc: meal.desc,
      date: meal.date,
      is_diet: meal.is_diet,
    })
    return res.status(201).send()
  } catch (error) {
    console.error(
      `${createMeal.name} :: error on insert on database :: error :: ${error}`
    )
    return res.status(500).send('Internal Server Error')
  }
}
