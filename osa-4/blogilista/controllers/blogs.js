const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const likes = request.body.likes
        ? request.body.likes
        : 0

    if (!(request.body.title && request.body.url)) {
        return response.status(400).json({ error: 'missing title or URL' })
    }

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes,
        user: request.user.id
    })

    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog === null) {
        return response.status(404).json({ error: 'bad id' })
    }

    if (blog.user.toString() !== request.user.id.toString()) {
        return response.status(401).json({ error: 'trying to delete another user\'s blog' })
    }

    request.user.blogs = request.user.blogs.filter(blogId => blogId.toString() !== request.params.id.toString())
    await request.user.save()
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog === null) {
        return response.status(404).json({ error: 'bad id' })
    }

    if (blog.user.toString() !== request.user.id.toString()) {
        return response.status(401).json({ error: 'trying to modify another user\'s blog' })
    }

    const putBlog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: request.user.id
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, putBlog, { new: true, runValidators: true, context: 'query' })
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter