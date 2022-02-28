const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const pwCorrect = user && await bcrypt.compare(password, user.passwordHash)

  if (!pwCorrect) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60*60 })

  response.status(200).json({
    token,
    username: user.username,
    name: user.name,
  })
})

module.exports = loginRouter