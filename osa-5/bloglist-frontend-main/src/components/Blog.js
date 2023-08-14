import { useState } from 'react'

const Blog = ({ blog, username, handleUpdate, handleDelete }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const [showFull, setShowFull] = useState(false)

    const toggleView = () => {
        setShowFull(!showFull)
    }

    const handleLike = async () => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1
        }

        handleUpdate(updatedBlog)
    }

    const askAndDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            handleDelete(blog.id)
        }
    }

    const shortView = () => (
        <div>
            {blog.title} {blog.author} <button onClick={toggleView}>view</button>
        </div>
    )

    const fullView = () => (
        <div>
            {blog.title} {blog.author} <button onClick={toggleView}>hide</button><br/>
            {blog.url}<br/>
            likes {blog.likes} <button onClick={() => handleLike()}>like</button><br/>
            {blog.user.name}<br/>
            {blog.user.name === username && <button onClick={askAndDelete}>delete</button>}
        </div>
    )

    return (
        <div style={blogStyle} className='blog'>
            {!showFull && shortView()}
            {showFull && fullView()}
        </div>
    )
}

export default Blog