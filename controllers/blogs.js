const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
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