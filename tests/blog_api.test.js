const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { initBlogs, newBlog, newBlogWithNoLikes, newBlogWithNoUrl, newBlogWithNoTitle } = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'hellas', passwordHash, name: 'H Ella' })
    await user.save()

    const token = await api.post('/api/login').send({ username: 'hellas', password: 'password' })

    await Blog.deleteMany({})
    const promises = initBlogs.map(x => api.post('/api/blogs').send(x).set('authorization', `Bearer ${token.body.token}`))
    await Promise.all(promises)
  })
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initBlogs.length)
  })
  test('the unique identifier property of the blog posts is named id', async () => {
    const res = await api.get('/api/blogs')
    const b = res.body[0]
    expect(b.id).toBeDefined()
    expect(b._id).not.toBeDefined()
  })
  test('making an HTTP POST request to the /api/blogs url successfully creates a new blog post', async () => {
    const token = await api.post('/api/login').send({ username: 'hellas', password: 'password' })
    await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${token.body.token}`)
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(initBlogs.length + 1)
  })
  test('adding a blog return 401 if token is not provided', async() => {
    try {
      await api.post('/api/blogs').send(newBlogWithNoLikes)
    } catch (e) {
      expect(e.status).toBe(401)
    }
  })
  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const token = await api.post('/api/login').send({ username: 'hellas', password: 'password' })
    await api.post('/api/blogs').send(newBlogWithNoLikes).set('authorization', `Bearer ${token.body.token}`)
    const res = await api.get('/api/blogs')
    const blogs = res.body
    const last = blogs[blogs.length - 1]
    expect(last.likes).toBe(0)
  })
  test('of missing title when creating a blog will return 400', async () => {
    try {
      const token = await api.post('/api/login').send({ username: 'hellas', password: 'password' })
      await api.post('/api/blogs').send(newBlogWithNoTitle).set('authorization', `Bearer ${token.body.token}`)
    } catch (e) {
      expect(e.status).toBe(400)
    }
  })
  test('of missing url when creating a blog will return 400', async () => {
    try {
      const token = await api.post('/api/login').send({ username: 'hellas', password: 'password' })
      await api.post('/api/blogs').send(newBlogWithNoUrl).set('authorization', `Bearer ${token.body.token}`)
    } catch (e) {
      expect(e.status).toBe(400)
    }
  })
  test('of deleting a blog will return 204', async () => {
    const token = await api.post('/api/login').send({ username: 'hellas', password: 'password' })
    const resBefore = await api.get('/api/blogs')
    const b = resBefore.body[0]
    const deleteRes = await api.delete(`/api/blogs/${b.id}`).set('authorization', `Bearer ${token.body.token}`)
    const getRes = await api.get('/api/blogs')
    expect(deleteRes.status).toBe(204)
    expect(getRes.body).toHaveLength(resBefore.body.length - 1)
  })
  test('update blog\'s likes', async () => {
    const resBefore = await api.get('/api/blogs')
    const b = resBefore.body[0]
    const newObj = Object.assign({}, b, { likes: 100 })
    const token = await api.post('/api/login').send({ username: 'hellas', password: 'password' })
    const res = await api.put(`/api/blogs/${b.id}`).send(newObj).set('authorization', `Bearer ${token.body.token}`)
    expect(res.status).toBe(200)

    const resAfter = await api.get('/api/blogs')
    const bAfter = resAfter.body[0]
    expect(bAfter).toEqual(Object.assign({}, b, { likes: 100 }))
  })
})

afterAll(() => {
  mongoose.connection.close()
})