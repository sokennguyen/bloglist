const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
const blogsList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 30,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]


describe('dummy', () => {
  test('dummy returns 1',() => {
    const blogs = []

    expect(listHelper.dummy(blogs)).toBe(1)
  })
})

describe('like', () => {
  test('when list has one blog, result is the like of that one',() => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
  test('list have 5 blogs with total likes of 59',() => {
    const result = listHelper.totalLikes(blogsList)
    expect(result).toBe(59)
  })
})

describe('most blogs', () => {
  test('when list has one author, result is that one',() => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toStrictEqual({ 'author': 'Edsger W. Dijkstra','blogs': 1 })
  })
  test('list have 5 blogs with 3 different authors',() => {
    const result = listHelper.mostBlogs(blogsList)
    expect(result).toStrictEqual({ 'author': 'Robert C. Martin', 'blogs': 3 })
  })
})

describe('most liked', () => {

  test('when list has one author, result is that one',() => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toStrictEqual({ 'author': 'Edsger W. Dijkstra','likes': 5 })
  })
  test('list have 5 blogs with 3 different authors',() => {
    const result = listHelper.mostLikes(blogsList)
    expect(result).toStrictEqual({ 'author': 'Michael Chan', 'likes': 30 })
  })
})