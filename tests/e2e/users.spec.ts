import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import app from '../../src/app'
import { execSync } from 'node:child_process'
import supertest from 'supertest'

describe('User Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run migrate:rollback')
    execSync('npm run migrate:latest')
  })
  describe('createUser', () => {
    it('Should return 400 for invalid body', async () => {
      const response = await supertest(app.server).post('/users').send({})
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.text)).toStrictEqual({
        errors: {
          messages: ['field name is required', 'field email is required'],
        },
      })
    })
    it('Should return 400 for invalid email', async () => {
      const response = await supertest(app.server).post('/users').send({
        name: 'test',
        email: 'test.com',
      })
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.text)).toStrictEqual({
        errors: {
          messages: ['Invalid email'],
        },
      })
    })
    it('Should return 400 for already registered email', async () => {
        await supertest(app.server).post('/users').send({
          name: 'test',
          email: 'test@gmail.com',
        }).expect(201)
        const response = await supertest(app.server).post('/users').send({
            name: 'test',
            email: 'test@gmail.com',
          })
        expect(response.statusCode).toBe(400)
        expect(response.text).toStrictEqual('Email already registered')
      })
    it('Should create an user', async () => {
      await supertest(app.server)
        .post('/users')
        .send({
          name: 'test',
          email: 'test@gmail.com',
        })
        .expect(201)
    })
  })
  describe('listUsers', () => {
    it('Should list users', async () => {
     await supertest(app.server)
        .post('/users')
        .send({
          name: 'marcio',
          email: 'marcio@gmail.com',
        })
      const listUsersResponse = await supertest(app.server).get('/users')
      expect(listUsersResponse.statusCode).toBe(200)
      expect(listUsersResponse.body.users).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          session_id: expect.any(String),
          name: 'marcio',
          email: 'marcio@gmail.com',
          created_at: expect.any(String),
        }),
      ])
    })
  })
})
