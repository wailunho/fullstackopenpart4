const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, password, name} = request.body

  const existingUser = await User.findOne({username})
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const salt = 10
  const passwordHash = await bcrypt.hash(password, salt)

  const user = new User({
    username,
    passwordHash,
    name
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter