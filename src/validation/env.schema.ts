import { z } from 'zod'

export const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    PORT: z.coerce.number().default(3333),
    DATABASE_CLIENT: z.enum(['pg', 'sqlite']).default('pg'),
    DATABASE_URL: z.string()
})