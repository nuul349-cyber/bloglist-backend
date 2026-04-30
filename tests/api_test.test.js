const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(initialBlogs)
})

test('all notes are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})