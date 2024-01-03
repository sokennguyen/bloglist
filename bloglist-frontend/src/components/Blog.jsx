import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog , handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisibleFalse = { display: visible ? 'none' : '' }
  const showWhenVisibleTrue = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const uploadedUser = blog.user !== null
    ? <> {blog.user.username} <br /> </>
    : null

  const increasedLikeBlog = (event) => {
    event.preventDefault()
    handleLike({
      title:blog.title,
      author:blog.author,
      url:blog.url,
      likes:blog.likes+1,
      id:blog.id,
      user:blog.user
    })
  }

  const removeBlog = () => {
    if (window.confirm(`Delete ${blog.title}?`))
      handleDelete(blog.id)
  }

  return (
    <div className="blog" >
      <div className='view-close' style={showWhenVisibleFalse}>
        {blog.title} - {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div className='view-open' style={showWhenVisibleTrue}>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        {blog.likes} <button onClick={increasedLikeBlog}>like</button> <br />
        {uploadedUser}
        {window.localStorage.getItem('loggedBlogappUser').token === blogService.token
          && <button className="removeButton" onClick={removeBlog}>remove</button>
        }
      </div>
    </div>
  )
}

export default Blog