import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  PORT: z.coerce.number().default(3333),
})

/*
    o parse() faz a validação entre as variaveis do nosso arquivo
    .env com a do nosso envSchema e dispara um erro (throw new Error())
    caso alguma das variaveis não passem na validação.
*/
/*
    o safeParse() diferente do parse() não dispara um erro diretamente.
*/
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('(┬┬﹏┬┬) Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data
