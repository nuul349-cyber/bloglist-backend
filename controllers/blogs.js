const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name')
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({ ...request.body, user: user.id })

  const result = await blog.save()

  user.blogs = user.blogs.concat(result.id)
  await user.save()
  const newBlog = await result.populate('user', 'username name')
  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(400).json({ error: 'invalid user' })
  }
  await Blog.deleteOne(blog)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const {
    title,
    author,
    url,
    likes,
    user,
  } = request.body


  const blog = await Blog.findById(request.params.id)
  if(!blog) return response.status(404).end()

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes
  blog.user = user

  const updatedBlog = await blog.save()
  const popBlog = await updatedBlog.populate('user', 'username name')
  response.json(popBlog)
})

module.exports = blogsRouter