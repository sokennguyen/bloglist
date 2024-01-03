const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./api_test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async() => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())

  const user = await User.findOne()
  await Blog.updateMany(
    {},
    {$set: {user:user._id}}
  )
  await Promise.all(promiseArray)
},100000)

describe('viewing all of the blogs', () => {
  test('get all blogs in the DB', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have id property instead of _id', async() => {
    const blogsAtStart = await helper.blogsInDb()

    blogsAtStart.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })


})

describe('posting a blog', () => {
  test('posting a non existing blog in the DB', async() => {
    const newBlog = {
      title:'this is a posted test blog',
      author: 'Kien Nguyen',
      url: 'nskien.xyz',
      likes: 18
    }

    const login = {
      username:'test',
      password:'password'
    }

    const loginResult = await api
      .post('/api/login')
      .send(login)
    
    await api
      .post('/api/blogs')
      .auth(loginResult.body.token , {type: 'bearer'})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('this is a posted test blog')
  })

  test('blog missing likes returns 0', async() => {
    const newBlog = {
      title:'this is blog with missing likes',
      author:'Kien Nguyen',
      url:'nskien.xyz'
    }

    const login = {
      username:'test',
      password:'password'
    }

    const loginResult = await api
      .post('/api/login')
      .send(login)

    await api
      .post('/api/blogs')
      .auth(loginResult.body.token, {type: 'bearer'})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

    const targetBlog= blogsAtEnd.find(blog => blog.title===newBlog.title)
    expect(targetBlog.likes).toBe(0)
  })

  test('blog missing title or url returns 400 Bad Request', async() => {
    const missingUrlBlog = {
      title:'this is a blog with missing url and should not be successfully added',
      author:'Kien Nguyen',
      likes:1
    }

    const missingTitleBlog={
      author:'Kien Nguyen',
      url:'nskien.xyz',
      likes:2
    }

    const login = {
      username:'test',
      password:'password'
    }

    const loginResult = await api
      .post('/api/login')
      .send(login)

    await api
      .post('/api/blogs')
      .auth(loginResult.body.token, {type:'bearer'})
      .send(missingUrlBlog)
      .expect(400)

    await api
      .post('/api/blogs')
      .auth(loginResult.body.token, {type:'bearer'})
      .send(missingTitleBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('return 401 if token is not provided',async()=>{
    const normalNewBlog = {
      title:'this blog does not have a token so should not be posted',
      author:'Kien',
      url:'example.org',
      likes:0
    }
    await api
      .post('/api/blogs')
      .send(normalNewBlog)
      .expect(401)

  })
})

describe('deletion of a blog',() => {
  test('delete an existing blog with id returns 204',async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const login = {
      username:'test',
      password:'password'
    }

    const loginResult = await api
      .post('/api/login')
      .send(login)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(loginResult.body.token, {type:'bearer'})
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length -1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)

  })

  test('return 401 unauthorized when token is not provided', async()=>{
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api 
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })
})

describe('changing one specific blog', () => {
  test('changing title of one blog that exists', async() => {
    const blogsAtStart = await helper.blogsInDb()
    let targetBlog = blogsAtStart[0]

    targetBlog.title='changed title'
    await api
      .put(`/api/blogs/${targetBlog.id}`)
      .send(targetBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const title= blogsAtEnd[0].title
    expect(title).toBe('changed title')
  })
})
afterAll(async() => {
  await mongoose.connection.close()
})