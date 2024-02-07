import { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ postBlog }) => {
  const [title,setTitle]= useState('')
  const [author,setAuthor]=useState('')
  const [url, setUrl] = useState('')
  const [visible, setVisible] = useState(false)

  const showWhenVisibleTrue = { display: visible ? '' : 'none' }
  const showWhenVisibleFalse = { display: visible ? 'none' : '' }

  const createBlog = (event) => {
    event.preventDefault()
    postBlog({
      title: title,
      author: author,
      url: url,
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <>
      <div style={showWhenVisibleFalse}>
        <button id='createButton' onClick={toggleVisibility}>create blog</button>
      </div>
      <div style={showWhenVisibleTrue}>
            Create A Post:
        <form onSubmit={createBlog}>
          <div>
            <label htmlFor="title-field">Title:</label>
            <input
              type="text"
              value={title}
              name="Title"
              id='title-field'
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            <label htmlFor="author-field">Author:</label>
            <input
              type="text"
              value={author}
              name='Author'
              id='author-field'
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            <label htmlFor="url-field">Url:</label>
            <input
              type="text"
              value={url}
              name='Url'
              id='url-field'
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button className='post-button' type='submit'>Post</button> <br />
        </form>
        <button onClick={toggleVisibility}> cancel </button>
      </div>
    </>
  )
}

BlogForm.propTypes = {
  postBlog: PropTypes.func.isRequired,
}

export default BlogForm