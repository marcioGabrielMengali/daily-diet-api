import { config } from 'dotenv'
import { envSchema } from '../schemas/env.schema'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('Error on ENV Variables !!!', result.error.issues)
  throw new Error('Invalid ENV Variables')
} else {
  console.log('Success on read ENV Variables', result.data)
}

export const env = result.data
