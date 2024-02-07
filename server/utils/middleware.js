const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (request,response,next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')){
    const token =  authorization.replace('Bearer ', '')
    request.token = token
  }

  next()
}

const userExtractor = async (request,response,next) => {

  if (request.token === undefined)
    response.status(401).json({ error: 'token missing' })

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(decodedToken.id===null)
    return response.status(401).json({ error:'token invalid' })

  request.user = await User.findById(decodedToken.id)
  next()
}
module.exports = { errorHandler, tokenExtractor, userExtractor }