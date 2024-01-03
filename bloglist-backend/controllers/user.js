const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async(request,response) => {
  const users = await User.find({})
    .populate('blogs', { url:1,title:1,author:1 })
  response.json(users)
})

userRouter.get('/:id', async(request,response)=>{
  const user = await User.findById(request.params.id)
  response.json(user)
})

userRouter.post('/', async(request,response) => {
  const { username,name,password } = request.body

  if (password === undefined || password.length<3) {
    return response.status(400).json({ error:'password must be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const hashedUser = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await hashedUser.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter