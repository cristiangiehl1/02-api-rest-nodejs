import { env } from './env'
import { app } from './app'

// app.listen retorna uma promise.
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server Running on PORT 3333.')
  })
