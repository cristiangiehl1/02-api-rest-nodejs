import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE
app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

// app.listen retorna uma promise.
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server Running on PORT 3333.')
  })
