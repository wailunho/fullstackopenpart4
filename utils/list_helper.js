const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs = []) => {
  return blogs.reduce((sum, cur) => sum + cur.likes, 0)
}

const favoriteBlog = (blogs = []) => {
  if (!blogs.length) {
    return null
  }
  if (blogs.length === 1) {
    return blogs[0]
  }
  return blogs.reduce((sum, cur) => sum.likes < cur.likes ? cur : sum, { likes: 0 })
}

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null
  }
  if (blogs.length === 1) {
    const b = blogs[0]
    return {
      author: b.author,
      blogs: 1,
    }
  }
  const b = _.chain(blogs).groupBy('author').toPairs().maxBy(x => x[1]).value()
  return {
    author: b[0],
    blogs: b[1].length,
  }
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null
  }
  if (blogs.length === 1) {
    const b = blogs[0]
    return {
      author: b.author,
      likes: b.likes,
    }
  }
  const b = _.chain(blogs).groupBy('author').toPairs().maxBy(x => _.sumBy(x[1], 'likes')).value()
  return {
    author: b[0],
    likes: _.sumBy(b[1], 'likes'),
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}