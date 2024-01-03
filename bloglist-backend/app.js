const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('express-async-errors')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery',false)
mongoose.connect(config.MONGODB_URI)

app.use(express.static('dist'))
app.use(express.json())

app.use('/api/users',userRouter)
app.use('/api/blogs',blogRouter)
app.use('/api/login',loginRouter)

if (process.env.NODE_ENV === 'test'){
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing',testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app