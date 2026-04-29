const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listManyBlogs = [
  {
    _id: '5a422aa71b54f676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a67623sd17f8',
    title: 'Go To Statement Harmful',
    author: 'EdW. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Ditra68.pdf',
    likes: 3,
    __v: 0
  },
  {
    _id: '5a422aa71b54ah76234d17f8',
    title: 'Go Statement Considered Harmful',
    author: 'W. Dtra',
    url: 'https://homepages.cwi.nl/~storm/teacing/reader/Dijksra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234h17f8',
    title: 'Go To Statement Considered',
    author: 'W. Dijkstra',
    url: 'https://homepages.cwi.nl/orm/teaching/reader/Dijkstra68.pdf',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa7hb54a676234d17f8',
    title: 'To Statement Considered Harmful',
    author: 'Edsger W.',
    url: 'https://homepages.cwi.nltorm/teaching/reader/Dijkstra68.pdf',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422aa71b54ah76234d17f8',
    title: 'Go Considered Harmful',
    author: 'Edsger Dijkstra',
    url: 'https://homepagewi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 9,
    __v: 0
  }
]

const listRepeatedAuthors = [
  {
    _id: '5a422aa71b54f676234d17f8',
    title: 'Title1',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 3,
    __v: 0
  },
  {
    _id: '5a422aa71b54fs76234d17f8',
    title: 'Title3',
    author: 'Ed',
    url: 'https://hsages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422aa71b54f6762d4d17f8',
    title: 'Title2',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/dorm/teaching/reader/Dijkstra68.pdf',
    likes: 1,
    __v: 0
  },
  {
    _id: '5a422aa71b54fs76234d17f8',
    title: 'Title3',
    author: 'Edsger W. Dijkstra',
    url: 'https://hsages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 4,
    __v: 0
  },
  {
    _id: '5a422aa71b54fs76234d17f8',
    title: 'Title3',
    author: 'Ed',
    url: 'https://hsages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 3,
    __v: 0
  },
  {
    _id: '5a422aa71b54fs76234d17f8',
    title: 'Title3',
    author: 'Edsger',
    url: 'https://hsages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422aa71b54fs76234d17f8',
    title: 'Title3',
    author: 'Ed',
    url: 'https://hsages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422aa71b54fs76234d17f8',
    title: 'Title3',
    author: 'Edsger',
    url: 'https://hsages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 1,
    __v: 0
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('of a bigger list is calculated adding all likes', () => {
    assert.strictEqual(listHelper.totalLikes(listManyBlogs), 31)
  })
})

describe('favorite blog', () => {
  test('of an empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog', () => {
    assert.strictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('of a bigger list', () => {
    assert.strictEqual(listHelper.favoriteBlog(listManyBlogs), listManyBlogs[5])
  })
})

describe('author with most blogs', () => {
  test('of an empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('when list has only one', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), { author:'Edsger W. Dijkstra', blogs:1 })
  })

  test('when doesn\'t have repeating authors', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listManyBlogs), { author:'Edsger W. Dijkstra', blogs:1 })
  })

  test('when list has repeating authors', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs(listRepeatedAuthors),
      { author:'Edsger W. Dijkstra', blogs:3 }
    )
  })
})

describe('author with most likes', () => {
  test('of an empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('when list has only one', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), { author:'Edsger W. Dijkstra', likes:5 })
  })

  test('when doesn\'t have repeating authors', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listManyBlogs), { author:'Edsger Dijkstra', likes:9 })
  })

  test('when list has repeating authors', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes(listRepeatedAuthors),
      { author:'Edsger W. Dijkstra', likes:8 }
    )
  })
})