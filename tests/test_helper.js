const User = require('../models/user')

const initBlogs = [
  {
    title: 'Algebra',
    author: 'Tom Smiths',
    url: 'https://tom-smiths-890.com',
    likes: 6,
  },
  {
    title: 'Fun with chinchilla',
    author: 'John Doe',
    url: 'https://john-doe-890.com',
    likes: 20,
  },
]

const newBlog = {
  title: 'Apple and cat',
  author: 'Doctor Fox',
  url: 'https://doctor-fox-890.com',
  likes: 31,
}

const newBlogWithNoLikes = {
  title: 'Banana and Dog',
  author: 'Doctor Fox',
  url: 'https://doctor-fox-890.com',
}

const newBlogWithNoTitle = {
  author: 'Doctor Fox',
  url: 'https://doctor-fox-890.com',
  likes: 31,
}

const newBlogWithNoUrl = {
  title: 'Banana and Dog',
  author: 'Doctor Fox',
  likes: 31,
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initBlogs,
  newBlog,
  newBlogWithNoLikes,
  newBlogWithNoTitle,
  newBlogWithNoUrl,
  usersInDb,
}