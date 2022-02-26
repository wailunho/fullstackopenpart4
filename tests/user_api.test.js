const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when one init user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'hellas', passwordHash })
    await user.save()
  })
  test('create user', async () => {
    const newUser = {
      username: 'jDoe',
      name: 'John Doe',
      password: 'password'
    }
    await api.post('/api/users').send(newUser).expect(201)
  })
  test('create user without unique username', async () => {
    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'word'
    }
    const res = await api.post('/api/users').send(newUser).expect(400)
    expect(res.body.error).toContain('username must be unique')
  })
})

afterAll(() => {
  mongoose.connection.close()
})