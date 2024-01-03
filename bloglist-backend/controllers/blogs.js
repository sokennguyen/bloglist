const Blog = require('../models/blog')
const router = require('express').Router()
const middleware = require('../utils/middleware')

router.get('/', async (request,response) => {
  const blogs = await Blog.find({})
    .populate('user', { username:1,name:1 })
  response.json(blogs)
})

router.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request,response) => {
  const body = request.body
  const user = request.user

  if (body.likes===undefined)
    body.likes=0
  else if (body.title ===undefined || body.url===undefined)
    return response.status(400).end()

  const newBlog = new Blog({
    title : body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

router.delete('/:id', middleware.tokenExtractor, middleware.userExtractor , async(request,response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (user.id !== blog.user.toString())
    return response.status(401).json({ error: 'token invalid' })

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
router.put('/:id', async(request,response) => {
  const body = request.body

  const blog ={
    title:body.title,
    url:body.url,
    author:body.author,
    likes:body.likes
  }


  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })
  response.json(updatedBlog)

})

module.exports=router