const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => {
  const reducer = (sum,item) => {
    return sum+item
  }
  return blogs.map(blog => blog.likes).reduce(reducer ,0)
}

const mostBlogs = (blogs) => {
  let countAuthorBlogs = _(blogs)
    .groupBy('author')
    .map((authors, id) => ({
      author: id,
      blogs: authors.length
    }))
    .value()

  countAuthorBlogs = _.maxBy(countAuthorBlogs,(object) => (object.blogs))

  return countAuthorBlogs
}

const mostLikes = (blogs) => {
  let countAuthorLike = _(blogs)
    .groupBy('author')
    .map((authors, id) => ({
      author: id,
      likes: _.sumBy(authors,'likes')
    }))
    .value()

  countAuthorLike = _.maxBy(countAuthorLike,(object) => (object.likes))

  return countAuthorLike
}

module.exports={
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes,
}

