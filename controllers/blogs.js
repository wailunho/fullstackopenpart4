const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { userExtractor } = require('../utils/middleware')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = new Blog(Object.assign({}, request.body, {user: user._id}))
    const result = await blog.save()
    response.status(201).json(result)
  } catch (e) {
    next(e)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const id = request.params.id
  try {
    const user = request.user
    const blog = await Blog.findById(id)
    if (!blog) {
      response.sendStatus(404)
    } else if (blog.user.toString() !== user._id.toString()) {
      response.sendStatus(401).json({error: 'unauthorized'})
    } else {
      await blog.remove()
      response.sendStatus(204)
    }
  } catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  const id = request.params.id
  try {
    const user = request.user
    const obj = Object.assign({}, request.body, {user: user._id})
    await Blog.findByIdAndUpdate(id, obj, { new: true, runValidators: true, context: 'query' })
    response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

module.exports = blogsRouter