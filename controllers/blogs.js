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
  response.status(201).json(result)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(400).json({ error: 'invalid user' })
  }
  const result = await Blog.deleteOne(blog)
  console.log(result)
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