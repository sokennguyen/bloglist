import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes - a.likes) )
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const postBlog = async (blogObject) => {
    const { title,author,url } = blogObject
    const addedBlog = await blogService.create({ title, author, url })
    if (addedBlog !== null) {
      setSuccessMessage(`Added: ${addedBlog.title}`)

      setBlogs(await blogService.getAll())
    }
    else setErrorMessage('Error, blog could not be added')

    setTimeout(() => {
      setSuccessMessage(null)
      setErrorMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <>
    Log into your account
      <form onSubmit={handleLogin}>
        <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            type="password"
            value={password}
            name='Password'
            id='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Log in</button>
      </form>
    </>
  )


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username,password })
      blogService.setToken(user.token)

      setUser(user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUsername('')
      setPassword('')
    }
    catch (exceptions) {
      setErrorMessage('Wrong Username or Password')
      console.log('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    location.reload()
  }
  const handleLike = async (likedBlog) => {
    await blogService.update(likedBlog.id,likedBlog)

    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a,b) => b.likes - a.likes))
  }
  const handleDelete = async (id) => {
    await blogService.remove(id)

    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a,b) => b.likes - a.likes))
  }
  const renderBlogList = () => (
    blogs.map(blog =>
      <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete}/>
    )
  )


  return (
    <div>
      <h1>Favorite Blogs</h1>
      <SuccessNotification successMessage={successMessage}/>
      <ErrorNotification errorMessage={errorMessage}/>

      {
        !user
          ? loginForm()
          : <div>
            <p>
              {user.name} logged in
              <button onClick={handleLogout}>log out</button>
            </p>

            <BlogForm postBlog={postBlog}/>


            {renderBlogList()}

          </div>


      }

    </div>
  )
}

export default App