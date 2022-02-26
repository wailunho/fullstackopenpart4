const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const res = await User.findOne({})
  const blog = new Blog(Object.assign({}, request.body, {user: res._id}))
  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (e) {
    next(e)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const blog = await Blog.findByIdAndDelete(id)
    if (blog) {
      response.sendStatus(200)
    } else {
      response.sendStatus(404)
    }
  } catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    await Blog.findByIdAndUpdate(id, request.body, { new: true, runValidators: true, context: 'query' })
    response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

module.exports = blogsRouter