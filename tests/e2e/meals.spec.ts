import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import app from '../../src/app'
import { execSync } from 'node:child_process'
import supertest from 'supertest'

describe('MealsRoutes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  beforeEach(() => {
    execSync('npm run migrate:rollback')
    execSync('npm run migrate:latest')
  })
  afterAll(async () => {
    app.close()
  })
  describe('createMeal', () => {
    it('Should return 400 for wrong body', async () => {
      const user = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = user.get('Set-Cookie')
      const expected = {
        errors: {
          messages: ['field name is required', 'field is_diet is required'],
        },
      }
      const response = await supertest(app.server)
        .post('/meals')
        .set('Cookie', cookies as string[])
        .send({})
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.text)).toStrictEqual(expected)
    })
    it('Should create meal', async () => {
      const user = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = user.get('Set-Cookie')
      await supertest(app.server)
        .post('/meals')
        .set('Cookie', cookies as string[])
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .expect(201)
    })
  })
  describe('ListMeals', () => {
    it('Should return meals', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const user = await supertest(app.server).get('/users').expect(200)
      const usedId = user.body.users[0].id
      const cookies = createUserResponse.get('Set-Cookie')
      await supertest(app.server)
        .post('/meals')
        .set('Cookie', cookies as string[])
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .expect(201)
      const expected = {
        meals: [
          {
            id: expect.any(String),
            user_id: usedId,
            name: 'breakfast',
            desc: 'eggs and bacon',
            date: Date.parse('2024-01-01'),
            is_diet: 1,
          },
        ],
      }
      const response = await supertest(app.server)
        .get('/meals')
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(expected)
    })
  })
  describe('getMeal', () => {
    it('Should retunr 400 for invalid uuid', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      const expected = {
        errors: {
          messages: ['Invalid uuid'],
        },
      }
      const response = await supertest(app.server)
        .get('/meals/AA67C1AB-D5E3-4CF8-A41A-')
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.text)).toStrictEqual(expected)
    })
    it('Should retunr 400 for id not found', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      const expected = 'Id not Found'
      const response = await supertest(app.server)
        .get('/meals/68CA29E2-D40A-49CE-AA71-CA8092232013')
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(400)
      expect(response.text).toStrictEqual(expected)
    })
    it('Should return 200 for meal', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const user = await supertest(app.server).get('/users').expect(200)
      const usedId = user.body.users[0].id
      const cookies = createUserResponse.get('Set-Cookie')
      await supertest(app.server)
        .post('/meals')
        .set('Cookie', cookies as string[])
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .expect(201)
      const meals = await supertest(app.server)
        .get('/meals')
        .set('Cookie', cookies as string[])
      const mealId = meals.body.meals[0].id
      const expected = {
        meal: {
          id: mealId,
          user_id: usedId,
          name: 'breakfast',
          desc: 'eggs and bacon',
          date: Date.parse('2024-01-01'),
          is_diet: 1,
        },
      }
      const response = await supertest(app.server)
        .get(`/meals/${mealId}`)
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(expected)
    })
  })
  describe('updateMeal', () => {
    it('Should return 400 for invalid body', async () => {
      const user = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = user.get('Set-Cookie')
      const expected = {
        errors: {
          messages: ['field name is required', 'field is_diet is required'],
        },
      }
      const response = await supertest(app.server)
        .put('/meals/5F29AA13-4958-46AD-B9F6-400B776E74E0')
        .set('Cookie', cookies as string[])
        .send({})
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.text)).toStrictEqual(expected)
    })
    it('Should return 400 for invalid uuid', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      const expected = {
        errors: {
          messages: ['Invalid uuid'],
        },
      }
      const response = await supertest(app.server)
        .put('/meals/AA67C1AB-D5E3-4CF8-A41A-')
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.text)).toStrictEqual(expected)
    })
    it('Should return 400 for id not found', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      const expected = 'Id not Found'
      const response = await supertest(app.server)
        .put('/meals/ECEB13F5-3F34-469D-9905-3C84AE72AE6A')
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(400)
      expect(response.text).toStrictEqual(expected)
    })
    it('Should update a meal', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const user = await supertest(app.server).get('/users').expect(200)
      const userId = user.body.users[0].id
      const cookies = createUserResponse.get('Set-Cookie')
      await supertest(app.server)
        .post('/meals')
        .set('Cookie', cookies as string[])
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .expect(201)
      const meals = await supertest(app.server)
        .get('/meals')
        .set('Cookie', cookies as string[])
      const mealId = meals.body.meals[0].id
      await supertest(app.server)
        .put(`/meals/${mealId}`)
        .send({
          name: 'lunch',
          desc: 'rice and chicken',
          is_diet: false,
          date: '2024-01-02',
        })
        .set('Cookie', cookies as string[])
        .expect(204)
      const expected = {
        meal: {
          id: mealId,
          user_id: userId,
          name: 'lunch',
          desc: 'rice and chicken',
          date: Date.parse('2024-01-02'),
          is_diet: 0,
        },
      }
      const response = await supertest(app.server)
        .get(`/meals/${mealId}`)
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(expected)
    })
  })
  describe('deleteMeal', () => {
    it('Should return 400 for invalid uuid', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      const expected = {
        errors: {
          messages: ['Invalid uuid'],
        },
      }
      const response = await supertest(app.server)
        .delete('/meals/AA67C1AB-D5E3-4CF8-A41A-')
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.text)).toStrictEqual(expected)
    })
    it('Should return 400 for id not found', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      const expected = 'Id not Found'
      const response = await supertest(app.server)
        .delete('/meals/ECEB13F5-3F34-469D-9905-3C84AE72AE6A')
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(400)
      expect(response.text).toStrictEqual(expected)
    })
    it('Should delete a meal', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      await supertest(app.server)
        .post('/meals')
        .set('Cookie', cookies as string[])
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .expect(201)
      const meals = await supertest(app.server)
        .get('/meals')
        .set('Cookie', cookies as string[])
      const mealId = meals.body.meals[0].id
      await supertest(app.server)
        .delete(`/meals/${mealId}`)
        .set('Cookie', cookies as string[])
        .expect(204)
      const response = await supertest(app.server)
        .get('/meals')
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(200)
      expect(response.body.meals.length).toStrictEqual(0)
    })
  })
  describe('melasMetrics', () => {
    it('Should return meals metrics', async () => {
      const createUserResponse = await supertest(app.server)
        .post('/users')
        .send({
          name: 'mealsTest',
          email: 'mealsTest@gmail.com',
        })
        .expect(201)
      const cookies = createUserResponse.get('Set-Cookie')
      await supertest(app.server)
        .post('/meals')
        .set('Cookie', cookies as string[])
        .send({
          name: 'breakfast',
          desc: 'eggs and bacon',
          is_diet: true,
          date: '2024-01-01',
        })
        .expect(201)
      const expected = {
        totalMeals: 1,
        onDiet: 1,
        offDiet: 0,
        bestSequenceOnDiet: 1,
      }
      const response = await supertest(app.server)
        .get('/meals/metrics')
        .set('Cookie', cookies as string[])
      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(expected)
    })
  })
})
