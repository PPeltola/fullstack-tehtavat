import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const [notifMessage, setNotifMessage] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const blogFormRef = useRef()

    const handleLogin = async ({ username, password }) => {
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
            setUser(user)
            blogService.setToken(user.token)
            return true
        } catch (exception) {
            setErrorMessage('invalid credentials')
            setTimeout(() => { setErrorMessage(null) }, 5000)
            return false
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()

        setUser(null)
        window.localStorage.removeItem('loggedBloglistUser')
    }

    const addBlog = async (blogObject) => {
        try {
            const newBlog = await blogService.create(blogObject)
            blogFormRef.current.toggleVisibility()
            setBlogs(await blogService.getAll())
            setNotifMessage(`added blog ${newBlog.title} by ${newBlog.author}`)
            setTimeout(() => { setNotifMessage(null) }, 5000)
            return true
        } catch (exception) {
            setErrorMessage(`blog creation failed: ${exception.response.data.error}`)
            setTimeout(() => { setErrorMessage(null) }, 5000)
            return false
        }
    }

    const handleBlogUpdate = async (blogObject) => {
        await blogService.update(blogObject)
        setBlogs(await blogService.getAll())
    }

    const handleBlogDelete = async blogId => {
        await blogService.deleteBlog(blogId)
        setBlogs(await blogService.getAll())
    }

    const Error = ({ message }) => {
        const style = {
            color: 'red',
            background: 'lightgrey',
            borderStyle: 'solid',
            borderRadius: 5,
            fontSize: 24,
            marginBottom: 10,
            padding: 10
        }

        if (message === null) {
            return null
        }

        return (
            <div style={style}>
                {message}
            </div>
        )
    }

    const Notification = ({ message }) => {
        const style = {
            color: 'green',
            background: 'lightgrey',
            borderStyle: 'solid',
            borderRadius: 5,
            fontSize: 24,
            marginBottom: 10,
            padding: 10
        }

        if (message === null) {
            return null
        }

        return (
            <div style={style}>
                {message}
            </div>
        )
    }

    const userView = () => (
        <div>
            <h2>blogs</h2>
            <p>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>
            <Togglable buttonLabel='new blog' initState={false} ref={blogFormRef}>
                <BlogForm addBlog={addBlog} />
            </Togglable>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    username={user.name}
                    handleUpdate={handleBlogUpdate}
                    handleDelete={handleBlogDelete} />
            )}
        </div>
    )

    return (
        <div>
            <Error message={errorMessage} />
            <Notification message={notifMessage} />
            {!user && <LoginForm handleLogin={handleLogin} />}
            {user && userView()}
        </div>
    )
}

export default App