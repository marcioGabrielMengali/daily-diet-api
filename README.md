# Daily Diet API

# Naviagtion
- [About](#about)
- [Technologies](#technologies)
- [Routes](#routes)
  - [Users](#users)
  - [Meals](#meals)

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
  --cookie sessionId=d847476d-857b-4642-84dc-1208dc3ee795 \
  --data '{
	"name": "marcio",
	"email": "marcio@gmail.com"
}'
```
### List Users
```shell
curl --request GET \
  --url http://localhost:3333/users \
  --header 'User-Agent: insomnia/10.3.0'
```

## Meals
### Create Meal
```shell
curl --location 'http://localhost:3333/meals' \
--header 'Cookie: sessionId=dfbfc4b5-a19e-4bee-93ca-d0ad69fd7358; sessionId=dfbfc4b5-a19e-4bee-93ca-d0ad69fd7358' \
--header 'Content-Type: application/json' \
--data '{
    "name": "breakfast",
    "desc": "eggs and bacon",
    "is_diet": true,
    "date": "2024-02-01"
}'
```
### Get Meals
```shell
curl --location 'http://localhost:3333/meals' \
--header 'Cookie: sessionId=dfbfc4b5-a19e-4bee-93ca-d0ad69fd7358'
```
### Get Meal
```shell
curl --location 'http://localhost:3333/meals/1af7896b-e1d7-4df2-bc4e-ee5417a70874' \
--header 'Cookie: sessionId=dfbfc4b5-a19e-4bee-93ca-d0ad69fd7358'
```
### Update Meal
```shell
curl --location --request PUT 'http://localhost:3333/meals/0d4c2bda-b8e8-41a4-b4e7-441180b9419b' \
--header 'Content-Type: application/json' \
--header 'Cookie: sessionId=dfbfc4b5-a19e-4bee-93ca-d0ad69fd7358' \
--data '{
    "name": "lunch",
    "desc": "rice and chicken",
    "is_diet": true
}'
```
### Delete Meal
```shell
curl --location --request DELETE 'http://localhost:3333/meals/2A3E267C-8158-4E28-99B1-8DB144748237' \
--header 'Cookie: sessionId=dfbfc4b5-a19e-4bee-93ca-d0ad69fd7358'
```
### Get Meal Metrics
```shell
curl --location 'http://localhost:3333/meals/metrics' \
--header 'Cookie: sessionId=dfbfc4b5-a19e-4bee-93ca-d0ad69fd7358'
```
