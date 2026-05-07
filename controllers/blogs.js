const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)


  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  const blog = new Blog({ ...request.body, user: user.id })

  const result = await blog.save()

  user.blogs = user.blogs.concat(result.id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const {
    title,
    author,
    url,
    likes,
  } = request.body


  const blog = await Blog.findById(request.params.id)
  if(!blog) return response.status(404).end()

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter