import { z } from 'zod'

export const createUserSchema = z.object({
    name: z.string({required_error: 'field name is required'}),
    email: z.string({required_error: 'field email is required'}).email()
})