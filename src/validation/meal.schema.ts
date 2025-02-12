import { z } from 'zod'

export const createMealSchema = z.object({
  name: z.string({ required_error: 'field name is required' }),
  desc: z.string().nullish(),
  is_diet: z.boolean({ required_error: 'field is_diet is required' }),
  date: z.coerce.date().nullish(),
})
