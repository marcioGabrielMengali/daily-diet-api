import { FastifyReply, FastifyRequest } from 'fastify'
import { createMealSchema, validateRouteId } from '../../validation/meal.schema'
import { formatError } from '../../utils/formatError'
import { knex } from '../../database'
import { randomUUID } from 'crypto'

export const createMeal = async (req: FastifyRequest, res: FastifyReply) => {
  const parsedBody = createMealSchema.safeParse(req.body)
  if (!parsedBody.success) {
    const fromattedErrors = formatError(parsedBody.error)
    console.error(
      `${createMeal.name} :: create Meal Schema :: error :: ${parsedBody.error}`
    )
    return res
      .status(400)
      .header('Content-Type', 'application/json')
      .send(JSON.stringify({ errors: fromattedErrors }))
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

export const listMeals = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const meals = await knex('meals').where('user_id', req.user.id).select('*')
    return { meals }
  } catch (error) {
    console.error(`${listMeals.name} :: get meals from db :: error :: ${error}`)
    return res.status(500).send('Internal Server Error')
  }
}

export const getMeal = async (req: FastifyRequest, res: FastifyReply) => {
  const parsedReqId = validateRouteId.safeParse(req.params)
  if (!parsedReqId.success) {
    const fromattedErrors = formatError(parsedReqId.error)
    console.error(
      `${getMeal.name} :: Request Id Schema :: error :: ${parsedReqId.error}`
    )
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }))
  }
  const { id } = parsedReqId.data
  try {
    const meal = await knex('meals').where('id', id).select('*').first()
    if (!meal) {
      return res.status(400).send('Id not Found')
    }
    return { meal }
  } catch (error) {
    console.error(
      `${getMeal.name} :: error on get meal from db :: error :: ${error}`
    )
    return res.status(500).send('Internal Server Error')
  }
}

export const updateMeal = async (req: FastifyRequest, res: FastifyReply) => {
  const parsedBody = createMealSchema.safeParse(req.body)
  const parsedReqId = validateRouteId.safeParse(req.params)
  if (!parsedBody.success) {
    const fromattedErrors = formatError(parsedBody.error)
    console.error(
      `${updateMeal.name} :: update Meal Schema :: error :: ${parsedBody.error}`
    )
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }))
  }
  if (!parsedReqId.success) {
    const fromattedErrors = formatError(parsedReqId.error)
    console.error(
      `${updateMeal.name} :: Request Id Schema :: error :: ${parsedReqId.error}`
    )
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }))
  }
  const { id } = parsedReqId.data
  const meal = parsedBody.data
  try {
    const rows = await knex('meals').where('id', id).update({
      name: meal.name,
      desc: meal.desc,
      date: meal.date,
      is_diet: meal.is_diet,
    })
    if (!rows) {
      return res.status(400).send('Id not Found')
    }
    return res.status(204).send()
  } catch (error) {
    console.error(
      `${updateMeal.name} :: error on update on database :: error :: ${error}`
    )
    return res.status(500).send('Internal Server Error')
  }
}

export const deleteMeal = async (req: FastifyRequest, res: FastifyReply) => {
  const parsedReqId = validateRouteId.safeParse(req.params)
  if (!parsedReqId.success) {
    const fromattedErrors = formatError(parsedReqId.error)
    console.error(
      `${deleteMeal.name} :: Request Id Schema :: error :: ${parsedReqId.error}`
    )
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }))
  }
  const { id } = parsedReqId.data
  try {
    const rows = await knex('meals').where('id', id).delete()
    if (!rows) {
      return res.status(400).send('Id not Found')
    }
    return res.status(204).send()
  } catch (error) {
    console.error(
      `${deleteMeal.name} :: error on delete on database :: error :: ${error}`
    )
    return res.status(500).send('Internal Server Error')
  }
}

export const mealMetrics = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const totalMeals = await knex('meals')
      .where('user_id', req.user.id)
      .count('id', { as: 'total' })
      .first()
    const totalMealsOnDiet = await knex('meals')
      .where('user_id', req.user.id)
      .andWhere('is_diet', true)
      .count('id', { as: 'total' })
      .first()
    const totalMealsOffDiet = await knex('meals')
      .where('user_id', req.user.id)
      .andWhere('is_diet', false)
      .count('id', { as: 'total' })
      .first()
    const totalMealsSequence = await knex('meals')
      .where('user_id', req.user.id)
      .select('is_diet', 'date')
      .orderBy('date', 'desc')
    console.log({ totalMealsSequence })
    const { bestSequence } = totalMealsSequence.reduce(
      (acc, meal) => {
        if (meal.is_diet) {
          acc.currentSequence += 1
        } else {
          acc.currentSequence = 0
        }
        if (acc.currentSequence > acc.bestSequence) {
          acc.bestSequence = acc.currentSequence
        }
        return acc
      },
      { bestSequence: 0, currentSequence: 0 }
    )
    return res
      .status(200)
      .header('content-type', 'application/json')
      .serialize({
        totalMeals: totalMeals?.total,
        onDiet: totalMealsOnDiet?.total,
        offDiet: totalMealsOffDiet?.total,
        bestSequenceOnDiet: bestSequence,
      })
  } catch (error) {
    console.error(
      `${mealMetrics.name} :: error on count in database :: error :: ${error}`
    )
    return res.status(500).send('Internal Server Error')
  }
}
