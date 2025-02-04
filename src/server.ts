import app from './app'
import { env } from './env'


app
  .listen({
    port: env?.PORT,
  })
  .then(() => console.log('Server is running on PORT: 3333'))

  app.get('/', (_, response) => {
    response.send('Hello World')
  })