import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function verifySessionId(req: FastifyRequest, res: FastifyReply) {
  const sessionId = req.cookies.sessionId
  if (!sessionId) {
    return res.status(401).send('Unauthorized')
  }
  try {
    const user = await knex('users')
      .where('session_id', sessionId)
      .select('*')
      .first()
    req.user = user
  } catch (error) {
    console.error(`${verifySessionId.name} :: error on database :: ${error}`)
    return res.status(500).send('Internal Server Error')
  }
}
