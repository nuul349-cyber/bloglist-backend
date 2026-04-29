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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}