const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}


const favoriteBlog = (blogs) => {
  if (!(blogs instanceof Array)) return null
  if (blogs.length === 0) return null
  const reducer = (currentFav, blog) => {
    if (currentFav.likes < blog.likes) return blog
    return currentFav
  }
  const result = blogs.reduce(reducer, blogs[0])
  return result
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  let authors = {}
  blogs.forEach(element => {
    if (authors[element.author]) authors[element.author] += 1
    else authors[element.author] = 1
  })
  const authorNames = Object.keys(authors)
  let most = authorNames[0]
  authorNames.forEach(name => {
    if (authors[name] > authors[most]) most = name
  })

  return { author: most, blogs:authors[most] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  let authors = {}
  blogs.forEach(element => {
    if (authors[element.author]) authors[element.author] += element.likes
    else authors[element.author] = element.likes
  })
  console.log(authors)
  const authorNames = Object.keys(authors)
  let most = authorNames[0]
  authorNames.forEach(name => {
    if (authors[name] > authors[most]) most = name
  })

  return { author: most, likes:authors[most] }
}


// console.log(
//   mostLikes([
//     { author:'a1', likes:3 },
//     { author:'a3', likes:3 },
//     { author:'a1', likes:3 },
//     { author:'a4', likes:3 },
//     { author:'a1', likes:3 },
//     { author:'a2', likes:3 },
//   ])
// )
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}