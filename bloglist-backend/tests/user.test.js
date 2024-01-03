const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./api_test_helper')

const User = require('../models/user')
const bcrypt = require('bcrypt')


describe('when there is initially one user in the DB',() => {
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password',10)
    const user = new User({
      username:'test',
      name:'Super User',
      passwordHash
    })

    await user.save()
  })

  test('creation suceeds with a fresh username', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username:'nskien',
      name:'Kien Nguyen',
      password:'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length+1)

    const userNames = usersAtEnd.map(user => user.name)
    expect(userNames).toContain(newUser.name)
  })

  test('creation failed with either missing username or password', async() => {
    const usersAtStart = await helper.usersInDb()

    const missingUsername = {
      name:'John Doe',
      password:'foo'
    }

    const missingPassword = {
      username:'foobar',
      name:'Foo Bar'
    }

    let result = await api
      .post('/api/users')
      .send(missingPassword)
      .expect(400)

    result = await api
      .post('/api/users')
      .send(missingUsername)
      .expect(400)


    expect(result.body.error)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

})


afterAll(async() => {
  await mongoose.connection.close()
})
