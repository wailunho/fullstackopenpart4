const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

const tokenExtractor = (request, response, next) => {
  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }
  request.token = getTokenFrom(request)
  next()
}

const userExtractor = async (request, response, next) => {
  const errorResponse = () => response.status(401).json({error: 'token missing or invalid'})

  if (!request.token) {
    return errorResponse()
  }
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return errorResponse()
  }
  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}