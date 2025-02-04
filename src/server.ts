import app from './app'

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server is running on PORT: 3333'))

  app.get('/', (_, response) => {
    response.send('Hello World')
  })