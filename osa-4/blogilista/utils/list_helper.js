require('core-js/actual/array/group')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (total, blog) => total + blog.likes
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, blog) => {
        return favorite.likes < blog.likes
            ? blog
            : favorite
    }

    return blogs.length === 0
        ? undefined
        : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
    const grouped = Object.entries(blogs.group(({ author }) => author))
    const reducer = (most, author) => {
        return most.blogs < author[1].length
            ? { author: author[0], blogs: author[1].length}
            : most
    }

    return grouped.length === 0
        ? undefined
        : grouped.reduce(reducer, { 
            author: grouped[0][0], 
            blogs: grouped[0][1].length 
        })
}

const mostLikes = (blogs) => {
    const grouped = Object.entries(blogs.group(({ author }) => author))
    const sumReducer = (total, blog) => total + blog.likes
    const reducer = (most, author) => {
        return most.likes < author[1].reduce(sumReducer, 0)
            ? { author: author[0], likes: author[1].reduce(sumReducer, 0)}
            : most
    }

    return grouped.length === 0
        ? undefined
        : grouped.reduce(reducer, { 
            author: grouped[0][0], 
            likes: grouped[0][1].reduce(sumReducer, 0) 
        })
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}