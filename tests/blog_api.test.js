const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { initBlogs, newBlog, newBlogWithNoLikes, newBlogWithNoUrl, newBlogWithNoTitle } = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const promises = initBlogs.map(async (x) => (new Blog(x)).save())
  await Promise.all(promises)
})

describe('when there is initially some blogs saved', () => {
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
    await api.post('/api/blogs').send(newBlog)
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(initBlogs.length + 1)
  })
  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    await api.post('/api/blogs').send(newBlogWithNoLikes)
    const res = await api.get('/api/blogs')
    const blogs = res.body
    const last = blogs[blogs.length - 1]
    expect(last.likes).toBe(0)
  })
  test('of missing title when creating a blog will return 400', async () => {
    try {
      await api.post('/api/blogs').send(newBlogWithNoTitle)
    } catch (e) {
      expect(e.status).toBe(400)
    }
  })
  test('of missing url when creating a blog will return 400', async () => {
    try {
      await api.post('/api/blogs').send(newBlogWithNoUrl)
    } catch (e) {
      expect(e.status).toBe(400)
    }
  })
})

afterAll(() => {
  mongoose.connection.close()
})