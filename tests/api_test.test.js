const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Title 1',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
  {
    title: 'Title 2',
    author: 'EdW. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Ditra68.pdf',
    likes: 3,
  },
  {
    title: 'Title3',
    author: 'W. Dtra',
    url: 'https://homepages.cwi.nl/~storm/teacing/reader/Dijksra68.pdf',
    likes: 5,
  },
  {
    title: 'Title4',
    author: 'W. Dijkstra',
    url: 'https://homepages.cwi.nl/orm/teaching/reader/Dijkstra68.pdf',
    likes: 7,
  },
  {
    title: 'Title5',
    author: 'Edsger W.',
    url: 'https://homepages.cwi.nltorm/teaching/reader/Dijkstra68.pdf',
    likes: 2,
  },
  {
    title: 'Title7',
    author: 'Edsger Dijkstra',
    url: 'https://homepagewi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 9,
  }
]

const getAllUsers = async () => {
  let users = await User.find({})
  return users.map(u => u.toJSON())
}

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(initialBlogs)
})

describe('Basic tests', () => {
  test('all notes are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
  })

  test('successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'https://url.com',
      likes: 321,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await Blog.find({})
    assert.strictEqual(blogsAfterPost.length, initialBlogs.length + 1)

    const result = await Blog.find(newBlog)
    assert(result.length > 0)
  })

  test('likes default to 0', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'https://url.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await Blog.find(newBlog)
    assert.strictEqual(result[0].likes, 0)
  })

  test('title required', async () => {
    const newBlog = {
      author: 'New Author',
      likes: 321,
      url: 'https://url.com',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterPost = await Blog.find({})
    assert.strictEqual(blogsAfterPost.length, initialBlogs.length)
  })

  test('url required', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      likes: 321,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterPost = await Blog.find({})
    assert.strictEqual(blogsAfterPost.length, initialBlogs.length)
  })
})

describe('DELETE method tests', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfterDeletion = await Blog.find({})
    const ids = blogsAfterDeletion.map(b => b.id)
    assert (!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAfterDeletion.length, initialBlogs.length - 1)
  })
})

describe('Updating Blogs', () => {
  test('Updates valid blogs', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    const blogsAfterUpdate = await Blog.find({})
    assert.strictEqual(blogsAfterUpdate.length, initialBlogs.length)

    const ids = blogsAfterUpdate.map(b => b.id)
    assert(ids.includes(blogToUpdate.id))

    const updatedBlog = await Blog.findById(blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
  })

  test('Fails on an invalid id', async () => {
    const invalidId = '67tads'
    const newBlog = {
      title: 'invalid',
      author: 'invalid',
      url: 'invalid',
      likes: 0,
    }
    await api
      .put(`/api/blogs/${invalidId}`)
      .send(newBlog)
      .expect(400)
  })

  test('Fails on a valid but unexisting id', async () => {
    const newBlog = {
      title: 'invalid',
      author: 'invalid',
      url: 'invalid',
      likes: 0,
    }
    const blog = new Blog(newBlog)
    await blog.save()
    await blog.deleteOne()

    const nonExistingId = blog._id.toString()

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(newBlog)
      .expect(404)
  })
})

describe('User creation with one user already in the database' , () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))

  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    assert(result.body.error.includes('already taken'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username doesn\'t have proper format', async () => {
    const usersAtStart = await getAllUsers()

    const newUser1 = {
      username: 'o',
      name: 'Superuser',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password doesn\'t have proper format', async () => {
    const usersAtStart = await getAllUsers()

    const newUser1 = {
      username: 'propername',
      name: 'Superuser',
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})

after(async () => {
  await mongoose.connection.close()
})