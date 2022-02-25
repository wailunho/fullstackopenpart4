const mongoose = require('mongoose')
const config = require('../utils/config')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const uri = config.MONGODB_URI
mongoose.connect(uri)

module.exports = mongoose.model('Blog', blogSchema)