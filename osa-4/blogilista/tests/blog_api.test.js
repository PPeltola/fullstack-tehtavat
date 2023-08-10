const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token

describe('when the database has been initialized with blogs', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        // create an user
        const savedUser = await api
            .post('/api/users')
            .send(helper.testUserPassword)
        
        // login with created user
        const loginCred = await api
            .post('/api/login')
            .send({ 
                username: helper.testUserPassword.username, 
                password: helper.testUserPassword.password 
            })
        
        // set received token visible to tests
        token = `Bearer ${loginCred.body.token}`
        
        await Blog.insertMany(helper.listWithManyBlogs)
    })

    test('blogs are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('correct amount of blogs are returned', async () => {
        const resp = await api.get('/api/blogs')
        expect(resp.body).toHaveLength(helper.listWithManyBlogs.length)
    })

    test('blogs have \'id\' parameter', async () => {
        const resp = await api.get('/api/blogs')
        for (let blog of resp.body) {
            expect(blog.id).toBeDefined()
        }
    })

    describe('adding a new blog', () => {
        test('a valid blog can be added', async () => {
            await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(helper.newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)
            expect(blogsAtEnd.map(blog => blog.url)).toContain(helper.newBlog.url)
        })

        test('a blog can\'t be added without a token', async () => {
            await api
                .post('/api/blogs')
                .send(helper.newBlog)
                .expect(401)
            
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
        })

        test('a new blog wihtout likes defaults to 0 likes', async () => {
            const noLikesBlog = {
                title: helper.newBlog.title,
                author: helper.newBlog.author,
                url: helper.newBlog.url
            }

            await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(noLikesBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd.find(blog => blog.url === helper.newBlog.url).likes).toEqual(0)
        })

        test('a new blog without title is not added', async () => {
            const noTitleBlog = {
                author: helper.newBlog.author,
                url: helper.newBlog.url
            }

            await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(noTitleBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
        })

        test('a new blog without url is not added', async () => {
            const noUrlBlog = {
                title: helper.newBlog.title,
                author: helper.newBlog.author
            }

            await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(noUrlBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
        })
    })

    describe('deleting a blog', () => {
        test('a blog can be deleted by id', async () => {
            // add a blog to delete
            const blogToBeDeleted = await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(helper.newBlog)
            
            // check new blog is added
            const blogsBeforeEnd = await helper.blogsInDb()
            expect(blogsBeforeEnd).toHaveLength(helper.listWithManyBlogs.length + 1)

            // delete the new blog
            await api
                .delete(`/api/blogs/${blogToBeDeleted.body.id}`)
                .set('Authorization', token)
                .expect(204)
            
            // check new blog is deleted
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
            expect(blogsAtEnd.map(blog => blog.title)).not.toContain(blogToBeDeleted.title)
        })
    })

    describe('updating a blog', () => {
        test('a blog can be updated by id', async () => {
            // add a blog to update
            const blogToBeUpdated = await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(helper.newBlog)
            
            // check new blog is added
            const blogsBeforeEnd = await helper.blogsInDb()
            expect(blogsBeforeEnd).toHaveLength(helper.listWithManyBlogs.length + 1)

            const updatedBlog = {
                title: helper.newBlog.title,
                author: helper.newBlog.author,
                url: helper.newBlog.url,
                likes: 42
            }

            await api
                .put(`/api/blogs/${blogToBeUpdated.body.id}`)
                .set('Authorization', token)
                .send(updatedBlog)
                .expect(200)
            
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd.map(blog => blog.likes)).toContain(42)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})