import { FastifyReply, FastifyRequest } from 'fastify'
import { createUserSchema } from '../../validation/users.schema'
import { formatError } from '../../utils/formatError'
import { knex } from '../../database'
import { randomUUID } from 'crypto'

export const createUser = async (req: FastifyRequest, res: FastifyReply) => {
  const result = createUserSchema.safeParse(req.body)

  if (!result.success) {
    const fromattedErrors = formatError(result.error)
    console.error(
      `${createUser.name} :: createUserSchame :: error :: ${result.error}`
    )
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }))
  }

  const { name, email } = result.data

  const user = await knex('users').where('email', email).select('email').first()

  if (user) {
    console.log(`${createUser.name} :: email exists :: ${email}`)
    return res.status(400).send('Email already registered')
  }

  let sessionId = req.cookies.sessionId

  if (!sessionId) {
    sessionId = randomUUID()
    res.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  try {
    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      email,
    })
    return res.status(201).send()
  } catch (error) {
    console.error(
      `${createUser.name} :: error on insert on database :: error :: ${error}`
    )
    return res.status(500).send('Internal Server Error')
  }
}

export const getUsers = async (_: FastifyRequest, res: FastifyReply) => {
  try {
    const users = await knex('users').select('*')
    return { users }
  } catch (error) {
    console.error(
      `${getUsers.name} :: error on insert on database :: error :: ${error}`
    )
    return res.status(500).send('Internal Server Error')
  }
}
