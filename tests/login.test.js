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
    const user = new User({ username: 'hellas', passwordHash, name: 'H Ella' })
    await user.save()
  })
  test('login to user', async () => {
    const login = {
      username: 'hellas',
      password: 'password'
    }
    const result = await api.post('/api/login').send(login).expect(200)
    expect(result.body).toHaveProperty('name')
    expect(result.body).toHaveProperty('token')
    expect(result.body).toHaveProperty('username')
  })
})

afterAll(() => {
  mongoose.connection.close()
})