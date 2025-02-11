# Daily Diet API

# Naviagtion
- [About](#about)
- [Technologies](#technologies)
- [Routes](#routes)

# About
It's a simple rest api peoject for daiy diet web api

# Technologies
- Nodejs
- Fastify
- Typescript
- Knex
- SQLLite

# Routes
## Users
### Create User
```shell
curl --request POST \
  --url http://localhost:3333/users \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.3.0' \
  --data '{
	"name": "marcio"
}'
```
### List Users
```shell
curl --request GET \
  --url http://localhost:3333/users \
  --header 'User-Agent: insomnia/10.3.0'
```