import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = await axios.post(baseUrl, newObject, config)
  return request.data
}

const update = async (id, newObject) => {
  const updatedBlog= await axios.put(`${baseUrl}/${id}`, newObject)
  return updatedBlog.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const removedBlog = await axios.delete(`${baseUrl}/${id}`,config)
  return removedBlog.data
}

export default { getAll , setToken, create, update, remove }